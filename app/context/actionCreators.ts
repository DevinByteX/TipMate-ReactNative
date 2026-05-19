/**
 * Action creator functions for all app reducers.
 * Use these instead of manually constructing action objects at dispatch call sites.
 * Benefits: single source of truth for payload shape; safer renaming; self-documenting dispatch calls.
 */

import {
    TipOptionState,
    SplitOptionState,
    TipAction,
    SplitAction,
    CurrencyConfigAction,
    SavedTipAction,
    DuplicatePreventionAction,
    LanguageAction,
    SplitConfigAction,
    SavedSplitPresetAction,
    SavedTip,
    ActiveSplitConfig,
    SavedSplitPreset,
} from './types';
import { CurrencyType } from '@configs';
import { ActionTypes } from './actionTypes';

// ── Tip options ──────────────────────────────────────────────────────────────

export const updateTipOption = (tip: TipOptionState): TipAction => ({
    type: ActionTypes.UPDATE_TIP_OPTIONS,
    payload: tip,
});

export const resetTipOptionsToDefault = (payload: TipOptionState[]): TipAction => ({
    type: ActionTypes.RESET_TIP_OPTIONS_TO_DEFAULT,
    payload,
});

// ── Split options ────────────────────────────────────────────────────────────

export const updateSplitOption = (split: SplitOptionState): SplitAction => ({
    type: ActionTypes.UPDATE_SPLIT_OPTIONS,
    payload: split,
});

export const resetSplitOptionsToDefault = (payload: SplitOptionState[]): SplitAction => ({
    type: ActionTypes.RESET_SPLIT_OPTIONS_TO_DEFAULT,
    payload,
});

// ── Currency ─────────────────────────────────────────────────────────────────

export const updateCurrencySign = (currency: CurrencyType): CurrencyConfigAction => ({
    type: ActionTypes.UPDATE_CURRENCY_SIGN,
    payload: currency,
});

export const resetCurrencyToSystem = (): CurrencyConfigAction => ({
    type: ActionTypes.RESET_CURRENCY_TO_SYSTEM,
});

// ── Language ─────────────────────────────────────────────────────────────────

export const setLanguage = (language: string, isRTL: boolean): LanguageAction => ({
    type: ActionTypes.SET_LANGUAGE,
    payload: { language, isRTL },
});

export const resetLanguageToSystem = (): LanguageAction => ({
    type: ActionTypes.RESET_LANGUAGE_TO_SYSTEM,
});

// ── Duplicate prevention ─────────────────────────────────────────────────────

export const updateDuplicatePreventionWindow = (value: number): DuplicatePreventionAction => ({
    type: ActionTypes.UPDATE_DUPLICATE_PREVENTION_WINDOW,
    payload: value,
});

// ── Saved tips ───────────────────────────────────────────────────────────────

export const saveTip = (tip: SavedTip): SavedTipAction => ({
    type: ActionTypes.SAVE_TIP,
    payload: tip,
});

export const deleteTip = (tipId: string): SavedTipAction => ({
    type: ActionTypes.DELETE_TIP,
    payload: tipId,
});

export const clearAllTips = (): SavedTipAction => ({
    type: ActionTypes.CLEAR_ALL_TIPS,
});

// ── Split session config ─────────────────────────────────────────────────────

export const setActiveSplitConfig = (config: ActiveSplitConfig): SplitConfigAction => ({
    type: ActionTypes.SET_ACTIVE_SPLIT_CONFIG,
    payload: config,
});

export const clearActiveSplitConfig = (): SplitConfigAction => ({
    type: ActionTypes.CLEAR_ACTIVE_SPLIT_CONFIG,
});

// ── Saved split presets ──────────────────────────────────────────────────────

export const saveSplitPreset = (preset: SavedSplitPreset): SavedSplitPresetAction => ({
    type: ActionTypes.SAVE_SPLIT_PRESET,
    payload: preset,
});

export const updateSplitPreset = (preset: SavedSplitPreset): SavedSplitPresetAction => ({
    type: ActionTypes.UPDATE_SPLIT_PRESET,
    payload: preset,
});

export const deleteSplitPreset = (id: string): SavedSplitPresetAction => ({
    type: ActionTypes.DELETE_SPLIT_PRESET,
    payload: id,
});
