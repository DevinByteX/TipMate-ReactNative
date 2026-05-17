/**
 * Narrow selector hooks for context-dependent UI components.
 *
 * These hooks extract only the specific slice of context state each component
 * needs, shielding the component from the full context API and making the
 * component easier to test (just mock the selector hook).
 */

import { useConfig, useUserSettings } from '@/context/AppContext';
import {
    TipOptionState,
    SplitOptionState,
    ConfigAction,
    UserSettingsAction,
} from '@/context/types';
import { CurrencyType } from '@configs';
import { ActionTypes } from '@/context/actionTypes';

// ---------------------------------------------------------------------------
// Read-only selectors
// ---------------------------------------------------------------------------

/** State slice needed by StyledTipOptions (read-only). */
export function useTipOptionsSelector() {
    const { state } = useConfig();
    return { tips: state.tips, tipSliderConfig: state.tipSliderConfig };
}

/** State slice needed by StyledSplitOptions (read-only). */
export function useSplitOptionsSelector() {
    const { state } = useConfig();
    return { splits: state.splits, splitSliderConfig: state.splitSliderConfig };
}

// ---------------------------------------------------------------------------
// Read + write selectors
// ---------------------------------------------------------------------------

/** State and actions needed by StyledTipOptionsEditMode. */
export function useTipOptionsEditSelector() {
    const { state, dispatch } = useConfig();
    return {
        tips: state.tips,
        tipSliderConfig: state.tipSliderConfig,
        updateTipOption: (tip: TipOptionState) =>
            dispatch({ type: ActionTypes.UPDATE_TIP_OPTIONS, payload: tip } as ConfigAction),
        resetTipsToDefault: (defaultTips: TipOptionState[]) =>
            dispatch({
                type: ActionTypes.RESET_TIP_OPTIONS_TO_DEFAULT,
                payload: defaultTips,
            } as ConfigAction),
    };
}

/** State and actions needed by StyledSplitOptionsEditMode. */
export function useSplitOptionsEditSelector() {
    const { state, dispatch } = useConfig();
    return {
        splits: state.splits,
        splitSliderConfig: state.splitSliderConfig,
        updateSplitOption: (split: SplitOptionState) =>
            dispatch({ type: ActionTypes.UPDATE_SPLIT_OPTIONS, payload: split } as ConfigAction),
        resetSplitsToDefault: (defaultSplits: SplitOptionState[]) =>
            dispatch({
                type: ActionTypes.RESET_SPLIT_OPTIONS_TO_DEFAULT,
                payload: defaultSplits,
            } as ConfigAction),
    };
}

/** State and actions needed by StyledCurrencySelector. */
export function useCurrencySelectorData() {
    const { state, dispatch } = useUserSettings();
    return {
        currencyConfig: state.currencyConfig,
        updateCurrency: (currency: CurrencyType) =>
            dispatch({
                type: ActionTypes.UPDATE_CURRENCY_SIGN,
                payload: currency,
            } as UserSettingsAction),
        resetToSystem: () =>
            dispatch({ type: ActionTypes.RESET_CURRENCY_TO_SYSTEM } as UserSettingsAction),
    };
}

/** State and actions needed by StyledLanguageSelector. */
export function useLanguageSelectorData() {
    const { state, dispatch } = useUserSettings();
    return {
        language: state.language,
        isRTL: state.isRTL,
        setLanguage: (language: string, isRTL: boolean) =>
            dispatch({
                type: ActionTypes.SET_LANGUAGE,
                payload: { language, isRTL },
            } as UserSettingsAction),
        resetToSystem: () =>
            dispatch({ type: ActionTypes.RESET_LANGUAGE_TO_SYSTEM } as UserSettingsAction),
    };
}

/** State and actions needed by StyledDuplicatePreventionSelector. */
export function useDuplicatePreventionSelectorData() {
    const { state, dispatch } = useUserSettings();
    return {
        duplicatePreventionWindow: state.duplicatePreventionWindow,
        updateWindow: (value: number) =>
            dispatch({
                type: ActionTypes.UPDATE_DUPLICATE_PREVENTION_WINDOW,
                payload: value,
            } as UserSettingsAction),
    };
}
