import { CurrencyType } from '@configs';

export interface TipOptionState {
  place: number;
  value: number;
}

export interface SplitOptionState {
  place: number;
  value: number;
}

export interface TipSliderConfigValues {
  min: number;
  max: number;
  step: number;
}

export interface SplitSliderConfigValues {
  min: number;
  max: number;
  step: number;
}

export interface IndividualSplit {
  id: string;
  name: string;
  allocationType: 'fixed' | 'percentage' | 'remainder';
  value?: number; // Dollar amount for 'fixed', percentage for 'percentage', undefined for 'remainder'
  calculatedAmount?: number; // Computed final amount after calculation
}

export interface SavedTip {
  id: string;
  timestamp: number;
  amount: number;
  tip: number;
  total: number;
  tipPercentage: number;
  numberOfPeople: number;
  splitType?: 'equal' | 'custom'; // default 'equal' when undefined (backward compatible)
  perPerson?: {
    amount: number;
    tip: number;
    total: number;
    tax?: number;
  };
  individualSplits?: IndividualSplit[]; // Array of individual split details for custom splits
  taxAmount?: number; // Tax amount applied (only when before-tax mode was used)
  taxMode?: 'before' | 'after'; // Whether tip was calculated before or after tax
  currencySymbol: string;
  currencyCode: string;
}

export interface ActiveSplitConfig {
  type: 'equal' | 'custom';
  customSplits?: IndividualSplit[];
}

export interface SavedSplitPreset {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  customSplits: IndividualSplit[];
}

export interface AppState {
  tips: TipOptionState[];
  splits: SplitOptionState[];
  tipSliderConfig: TipSliderConfigValues;
  splitSliderConfig: SplitSliderConfigValues;
  currencyConfig: CurrencyType | undefined; // undefined = use device currency, set = user preference
  savedTips: SavedTip[];
  duplicatePreventionWindow: number; // in minutes
  language: string | undefined; // Language code (e.g., 'en', 'es', 'ar')
  isRTL: boolean; // RTL layout flag
  activeSplitConfig?: ActiveSplitConfig; // Active split configuration (custom/equal)
  savedSplitPresets: SavedSplitPreset[]; // Saved custom split presets
}

export type TipAction =
  | { type: 'UPDATE_TIP_OPTIONS'; payload: TipOptionState }
  | { type: 'RESET_TIP_OPTIONS_TO_DEFAULT'; payload: TipOptionState[] };

export type SplitAction =
  | { type: 'UPDATE_SPLIT_OPTIONS'; payload: SplitOptionState }
  | { type: 'RESET_SPLIT_OPTIONS_TO_DEFAULT'; payload: SplitOptionState[] };

export type CurrencyConfigAction =
  | { type: 'UPDATE_CURRENCY_SIGN'; payload: CurrencyType }
  | { type: 'RESET_CURRENCY_TO_SYSTEM' };

export type SavedTipAction =
  | { type: 'SAVE_TIP'; payload: SavedTip }
  | { type: 'DELETE_TIP'; payload: string }
  | { type: 'CLEAR_ALL_TIPS' };

export type DuplicatePreventionAction = {
  type: 'UPDATE_DUPLICATE_PREVENTION_WINDOW';
  payload: number;
};

export type LanguageAction =
  | { type: 'SET_LANGUAGE'; payload: { language: string; isRTL: boolean } }
  | { type: 'RESET_LANGUAGE_TO_SYSTEM' };

export type SplitConfigAction =
  | { type: 'SET_ACTIVE_SPLIT_CONFIG'; payload: ActiveSplitConfig }
  | { type: 'CLEAR_ACTIVE_SPLIT_CONFIG' };

export type SavedSplitPresetAction =
  | { type: 'SAVE_SPLIT_PRESET'; payload: SavedSplitPreset }
  | { type: 'UPDATE_SPLIT_PRESET'; payload: SavedSplitPreset }
  | { type: 'DELETE_SPLIT_PRESET'; payload: string };

export type AppAction =
  | TipAction
  | SplitAction
  | CurrencyConfigAction
  | SavedTipAction
  | DuplicatePreventionAction
  | LanguageAction
  | SplitConfigAction
  | SavedSplitPresetAction
  | { type: 'LOAD_PERSISTED_STATE'; payload: AppState }; // Include LOAD_PERSISTED_STATE

// ---------------------------------------------------------------------------
// Domain state interfaces — used by the split-context architecture
// ---------------------------------------------------------------------------

export interface UserSettingsState {
  currencyConfig: CurrencyType | undefined;
  language: string | undefined;
  isRTL: boolean;
  duplicatePreventionWindow: number;
  showTaxInput: boolean;
}

export interface ConfigState {
  tips: TipOptionState[];
  splits: SplitOptionState[];
  tipSliderConfig: TipSliderConfigValues;
  splitSliderConfig: SplitSliderConfigValues;
}

export interface HistoryState {
  savedTips: SavedTip[];
  savedSplitPresets: SavedSplitPreset[];
}

export interface SplitSessionState {
  activeSplitConfig?: ActiveSplitConfig;
}

// Domain action union types
export type UserSettingsAction =
  | CurrencyConfigAction
  | DuplicatePreventionAction
  | LanguageAction
  | { type: 'SET_SHOW_TAX_INPUT'; payload: boolean }
  | { type: 'LOAD_PERSISTED_STATE'; payload: UserSettingsState };

export type ConfigAction =
  | TipAction
  | SplitAction
  | { type: 'LOAD_PERSISTED_STATE'; payload: ConfigState };

export type HistoryAction =
  | SavedTipAction
  | SavedSplitPresetAction
  | { type: 'LOAD_PERSISTED_STATE'; payload: HistoryState };
