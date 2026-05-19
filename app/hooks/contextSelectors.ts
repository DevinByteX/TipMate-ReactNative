/**
 * Narrow selector hooks for context-dependent UI components.
 *
 * These hooks extract only the specific slice of context state each component
 * needs, shielding the component from the full context API and making the
 * component easier to test (just mock the selector hook).
 */

import { useConfig, useUserSettings } from '@/context/AppContext';
import { TipOptionState, SplitOptionState } from '@/context/types';
import { CurrencyType } from '@configs';
import {
    updateTipOption,
    resetTipOptionsToDefault,
    updateSplitOption,
    resetSplitOptionsToDefault,
    updateCurrencySign,
    resetCurrencyToSystem,
    setLanguage,
    resetLanguageToSystem,
    updateDuplicatePreventionWindow,
} from '@/context/actionCreators';

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
            dispatch(updateTipOption(tip)),
        resetTipsToDefault: (defaultTips: TipOptionState[]) =>
            dispatch(resetTipOptionsToDefault(defaultTips)),
    };
}

/** State and actions needed by StyledSplitOptionsEditMode. */
export function useSplitOptionsEditSelector() {
    const { state, dispatch } = useConfig();
    return {
        splits: state.splits,
        splitSliderConfig: state.splitSliderConfig,
        updateSplitOption: (split: SplitOptionState) =>
            dispatch(updateSplitOption(split)),
        resetSplitsToDefault: (defaultSplits: SplitOptionState[]) =>
            dispatch(resetSplitOptionsToDefault(defaultSplits)),
    };
}

/** State and actions needed by StyledCurrencySelector. */
export function useCurrencySelectorData() {
    const { state, dispatch } = useUserSettings();
    return {
        currencyConfig: state.currencyConfig,
        updateCurrency: (currency: CurrencyType) =>
            dispatch(updateCurrencySign(currency)),
        resetToSystem: () =>
            dispatch(resetCurrencyToSystem()),
    };
}

/** State and actions needed by StyledLanguageSelector. */
export function useLanguageSelectorData() {
    const { state, dispatch } = useUserSettings();
    return {
        language: state.language,
        isRTL: state.isRTL,
        setLanguage: (language: string, isRTL: boolean) =>
            dispatch(setLanguage(language, isRTL)),
        resetToSystem: () =>
            dispatch(resetLanguageToSystem()),
    };
}

/** State and actions needed by StyledDuplicatePreventionSelector. */
export function useDuplicatePreventionSelectorData() {
    const { state, dispatch } = useUserSettings();
    return {
        duplicatePreventionWindow: state.duplicatePreventionWindow,
        updateWindow: (value: number) =>
            dispatch(updateDuplicatePreventionWindow(value)),
    };
}
