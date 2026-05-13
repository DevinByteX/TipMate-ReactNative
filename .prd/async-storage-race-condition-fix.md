# PRD: Fix AsyncStorage Race Conditions & State Persistence Data Loss

**Status:** Implemented ✅  
**Branch:** `feature/custom-split-improve`  
**Date:** 2026-05-14  
**Severity:** High — intermittent user-facing data loss on app restart and updates  

---

## 1. Problem Statement

Users intermittently lose persisted data (custom tip options, currency selection, saved tips, split presets, slider configurations) after:

- App fully killed and reopened
- App update installed
- Sudden restart / crash recovery
- Rapid sequence of changes followed by force-kill

The bug does not happen 100% of the time, which makes it difficult to reproduce consistently. The intermittent nature is a direct symptom of async race conditions, described in full below.

---

## 2. System Architecture — How Persistence Currently Works

### 2.1 State Model

All application state lives in a single `AppState` object defined in `app/context/types.ts`. The fields are:

| Field | Type | Description |
|---|---|---|
| `tips` | `TipOptionState[]` | Custom tip percentage options |
| `splits` | `SplitOptionState[]` | Custom split count options |
| `tipSliderConfig` | `TipSliderConfigValues` | Min/max/step for tip slider |
| `splitSliderConfig` | `SplitSliderConfigValues` | Min/max/step for split slider |
| `currencyConfig` | `CurrencyType \| undefined` | User-selected currency (undefined = device default) |
| `savedTips` | `SavedTip[]` | History of saved tip calculations |
| `duplicatePreventionWindow` | `number` | Minutes window for duplicate detection |
| `language` | `string \| undefined` | User language preference |
| `isRTL` | `boolean` | RTL layout flag derived from language |
| `activeSplitConfig` | `ActiveSplitConfig \| undefined` | Current active split session |
| `savedSplitPresets` | `SavedSplitPreset[]` | Saved custom split presets |

The entire `AppState` is serialised as JSON under the single AsyncStorage key `"APPSTATE"`.

### 2.2 `usePersistedReducer` — Single Persistence Layer

Located in `app/hooks/usePersistedReducer.ts`. This hook wraps React's `useReducer` and manages all AsyncStorage I/O through two `useEffect`s and a hydration ref:

**Effect 1 — Load (on mount):**

```ts
useEffect(() => {
  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(key);
      if (savedState) {
        dispatch({ type: 'LOAD_PERSISTED_STATE', payload: JSON.parse(savedState) });
      }
    } catch (error) {
      console.error('Failed to load state from AsyncStorage', error);
    } finally {
      isHydratedRef.current = true;
    }
  };
  loadState();
}, [key]);
```

**Effect 2 — Save (on every state change, guarded by hydration):**

```ts
useEffect(() => {
  if (!isHydratedRef.current) return;
  const saveState = async () => {
    await AsyncStorage.setItem(key, JSON.stringify(state));
  };
  saveState();
}, [state, key]);
```

The `isHydratedRef` flag (a `useRef`, not `useState`) ensures the save effect cannot fire before the initial load completes, regardless of I/O timing. This is the **only** write path to AsyncStorage.

### 2.3 `rootReducer` — `LOAD_PERSISTED_STATE`

Located in `app/context/rootReducer.ts`. When `usePersistedReducer` dispatches `LOAD_PERSISTED_STATE`, the root reducer maps every field from the payload using nullish coalescing (`??`), including the slider config fields:

```ts
case 'LOAD_PERSISTED_STATE':
  return {
    ...state,
    tips: action.payload.tips ?? state.tips,
    splits: action.payload.splits ?? state.splits,
    tipSliderConfig: action.payload.tipSliderConfig ?? state.tipSliderConfig,
    splitSliderConfig: action.payload.splitSliderConfig ?? state.splitSliderConfig,
    currencyConfig: action.payload.currencyConfig ?? state.currencyConfig,
    savedTips: action.payload.savedTips ?? state.savedTips,
    duplicatePreventionWindow: action.payload.duplicatePreventionWindow ?? state.duplicatePreventionWindow,
    language: action.payload.language ?? state.language,
    isRTL: action.payload.isRTL ?? state.isRTL,
    activeSplitConfig: action.payload.activeSplitConfig ?? state.activeSplitConfig,
    savedSplitPresets: action.payload.savedSplitPresets ?? state.savedSplitPresets,
  };
```

### 2.4 Reducers — Pure Functions

All reducers in `app/context/reducers.ts` are now pure functions. They compute and return new state only; no AsyncStorage access, no side effects. The `AsyncStorage` and `Constants` imports have been removed from this file.

---

## 3. Bugs

### Bug 1 — Startup Race Condition (Root Cause of Intermittent Data Loss) `CRITICAL`

**Description:**  
`usePersistedReducer` Effect 2 (save) runs on the **very first render** because `state` is initialised as `initialState` and is therefore a new reference. Both effects are scheduled after the first render in declaration order, but because both are async, their I/O operations run concurrently. There is no guarantee about which `AsyncStorage` operation completes first.

**Timeline when Effect 2 wins:**

```
App mounts → state = initialState
  ├── Effect 1 starts: AsyncStorage.getItem("APPSTATE")  ← reading...
  └── Effect 2 starts: AsyncStorage.setItem("APPSTATE", initialState)  ← writing...
       └── Write completes ← overwrites all persisted user data with defaults
  └── Effect 1 read completes → reads initialState (just overwritten) → dispatches LOAD_PERSISTED_STATE with defaults
```

Result: All saved user preferences are silently erased.

**Why it's intermittent:**  
On slow I/O (first boot, after update) or when the storage is cold (newly written entry), the read in Effect 1 may complete faster. On fast I/O or warm cache, Effect 2 writes before Effect 1 reads. The race is non-deterministic.

---

### Bug 2 — Dual-Write System Creates Concurrent Collisions `HIGH`

**Description:**  
When any action is dispatched, two write paths fire simultaneously and asynchronously:

1. The per-reducer `saveState(partial)` — reads current storage, merges partial, writes back
2. `usePersistedReducer` Effect 2 — writes entire current state

Both are uncoordinated. A typical collision scenario:

```
Action dispatched → reducer returns new state
  ├── Per-reducer saveState:
  │     ① getItem("APPSTATE") → reads stale snapshot S0
  │     ② ... waiting ...
  └── usePersistedReducer saveEffect:
        ① setItem("APPSTATE", S1) → writes updated state S1
  └── Per-reducer saveState:
        ② setItem("APPSTATE", merge(S0, partial)) → overwrites S1 with stale data
```

The last write wins, and if it contains stale data, the most recent state is lost.

---

### Bug 3 — Broken Array Spreading in `tipReducer` and `splitReducer` `HIGH`

**Description:**  
`tipReducer` receives `state: TipOptionState[]` (an array) and calls:

```ts
saveState({ ...state, tips: updatedTips });
```

Spreading a JavaScript array into an object produces numeric string keys, not field names:

```ts
// state = [{ place: 1, value: 5 }, { place: 2, value: 10 }]
{ ...state } === { "0": { place: 1, value: 5 }, "1": { place: 2, value: 10 } }
```

So `saveState` writes `{ "0": ..., "1": ..., tips: [...] }` into AsyncStorage. On the next merge, these garbage numeric keys persist and pollute the stored JSON object. `splitReducer` has the identical bug.

---

### Bug 4 — `tipSliderConfig` and `splitSliderConfig` Never Restored `MEDIUM`

**Description:**  
The `LOAD_PERSISTED_STATE` handler in `rootReducer.ts` explicitly maps every field — but `tipSliderConfig` and `splitSliderConfig` are absent:

```ts
case 'LOAD_PERSISTED_STATE':
  return {
    ...state,
    tips: action.payload.tips ?? state.tips,
    splits: action.payload.splits ?? state.splits,
    currencyConfig: action.payload.currencyConfig ?? state.currencyConfig,
    savedTips: action.payload.savedTips ?? state.savedTips,
    duplicatePreventionWindow: action.payload.duplicatePreventionWindow ?? state.duplicatePreventionWindow,
    language: action.payload.language ?? state.language,
    isRTL: action.payload.isRTL ?? state.isRTL,
    activeSplitConfig: action.payload.activeSplitConfig ?? state.activeSplitConfig,
    savedSplitPresets: action.payload.savedSplitPresets ?? state.savedSplitPresets,
    // tipSliderConfig and splitSliderConfig are missing
  };
```

`usePersistedReducer` saves these fields correctly (whole-state serialisation), but the restore handler never applies them. Both fields always revert to their `initialState` defaults after restart.

---

### Bug 5 — Per-Reducer `saveState` Reads Stale Data on Rapid Dispatch `MEDIUM`

**Description:**  
`saveState` uses a read-modify-write pattern. When two actions are dispatched in quick succession (e.g. save tip and update currency simultaneously), the second `getItem` may read a snapshot that predates the first `setItem`. The resulting merge loses the first write.

This is a subset of Bug 2 and is fully resolved by removing the per-reducer save layer.

---

## 4. Implementation

### Design Decision

**Removed the per-reducer `saveState` system entirely.** The `usePersistedReducer` save effect already serialises the complete state on every state change — the per-reducer saves were redundant. The redundancy was the source of all the collision and stale-data bugs.

The only remaining responsibility was to **prevent the save effect from firing before the initial load completes**, which was solved with a single `useRef` hydration guard.

The persistence system is now a single, deterministic write path:

```
Action dispatched → reducer computes new state → usePersistedReducer saves entire state
```

---

### Change 1 — Hydration guard in `usePersistedReducer` ✅

**File:** `app/hooks/usePersistedReducer.ts`

- Added `useRef` to React imports
- Added `const isHydratedRef = useRef(false)` after `useReducer`
- Added `finally { isHydratedRef.current = true }` to the load effect — hydration is marked complete whether the read succeeded, found nothing, or threw an error
- Added `if (!isHydratedRef.current) return` as the first line of the save effect

**Why `useRef` and not `useState`:**  
A ref mutation does not trigger a re-render. Using `useState` for the hydration flag would cause an extra render cycle and potentially re-introduce timing issues in the save effect.

**How it eliminates Bug 1:**

```
App mounts → state = initialState, isHydratedRef.current = false
  ├── Effect 1 starts: AsyncStorage.getItem("APPSTATE")
  └── Effect 2 runs:  isHydratedRef.current === false → returns early (no write)
  └── Effect 1 completes → isHydratedRef.current = true (set in finally)
       → dispatches LOAD_PERSISTED_STATE → state updates
  └── Effect 2 triggers from state change → isHydratedRef.current === true → saves ✓
```

---

### Change 2 — Removed per-reducer `saveState` system ✅

**File:** `app/context/reducers.ts`

- Removed `import AsyncStorage from '@react-native-async-storage/async-storage'`
- Removed `Constants` from the `@configs` import (was only used inside `saveState`)
- Removed all 15 `saveState(...)` call-sites across all 8 reducers
- Deleted the entire `saveState` async function

All reducers are now pure functions — they compute and return new state only. Persistence is handled entirely by the hook layer above. Bugs 2, 3, and 5 are eliminated.

---

### Change 3 — Restored missing fields in `LOAD_PERSISTED_STATE` ✅

**File:** `app/context/rootReducer.ts`

Added the two previously absent fields to the `LOAD_PERSISTED_STATE` mapping:

```ts
tipSliderConfig: action.payload.tipSliderConfig ?? state.tipSliderConfig,
splitSliderConfig: action.payload.splitSliderConfig ?? state.splitSliderConfig,
```

Both fields are now saved by `usePersistedReducer` and correctly restored on startup. Bug 4 is eliminated.

---

## 5. Files Changed

| File | Change |
|---|---|
| `app/hooks/usePersistedReducer.ts` | Add `useRef` import; add `isHydratedRef`; add `finally` block in load effect; add hydration guard in save effect |
| `app/context/reducers.ts` | Remove `AsyncStorage` import; remove `saveState` function; remove all `saveState(...)` call-sites from all reducers |
| `app/context/rootReducer.ts` | Add `tipSliderConfig` and `splitSliderConfig` to `LOAD_PERSISTED_STATE` mapping |

---

## 6. Bugs Fixed per Change

| Bug | Change 1 | Change 2 | Change 3 |
|---|---|---|---|
| Bug 1 — Startup race condition | ✅ Fixed | | |
| Bug 2 — Dual-write collisions | | ✅ Fixed | |
| Bug 3 — Array spread corruption | | ✅ Fixed | |
| Bug 4 — Missing slider config restore | | | ✅ Fixed |
| Bug 5 — Stale read-modify-write | | ✅ Fixed | |

---

## 7. Verification Plan

### 7.1 Manual Test Scenarios

| Scenario | Steps | Expected Result |
|---|---|---|
| Persist across full kill | Change a tip value → fully kill app → reopen | Custom tip value present |
| Persist across update | Change currency → apply app update → reopen | Currency preference retained |
| Rapid changes + force kill | Change tip, change split count, change currency in rapid succession → force kill → reopen | All three changes retained |
| Slider config persists | Adjust tip slider min/max → kill → reopen | Slider config restored |
| Fresh install | Install from scratch → open app | Defaults load without errors |
| Save preset + restart | Save a custom split preset → kill → reopen | Preset visible in list |
| Saved tips persist | Save a tip calculation → kill → reopen | Tip present in history |

### 7.2 Edge Cases

| Scenario | Expected Result |
|---|---|
| AsyncStorage unavailable on load | Error logged, initialState used, app functions normally |
| AsyncStorage unavailable on save | Error logged silently, no crash |
| Corrupted AsyncStorage JSON | `JSON.parse` throws, caught in try/catch, `isHydratedRef.current` still set to `true` in `finally` |
| App killed during a write | Partial write may leave corrupt JSON; on next load parse fails → caught → initialState used |

### 7.3 Regression Checks

- Language / RTL preference survives restart
- `duplicatePreventionWindow` survives restart
- `activeSplitConfig` survives restart (or clears if that is intended behaviour)

---

## 8. Out of Scope

The following are known but deliberately excluded from this fix to keep scope minimal:

- **Write queue / debounce:** A write queue would coalesce rapid state changes into fewer writes, reducing I/O. Not needed for correctness after these fixes.
- **`AsyncStorage.mergeItem`:** Could be used instead of full serialisation, but introduces complexity and doesn't eliminate the hydration race without the ref guard anyway.
- **`activeSplitConfig` session semantics:** Whether the active split configuration should be cleared on app restart is a product decision, not a persistence bug.
- **Schema migration:** If stored JSON from before this fix contains garbage numeric keys (from Bug 3), they will persist in existing installations. A migration step could clean these up but requires additional work and is not critical for correctness going forward.
