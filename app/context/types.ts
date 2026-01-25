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

export interface SavedTip {
  id: string;
  timestamp: number;
  amount: number;
  tip: number;
  total: number;
  tipPercentage: number;
  numberOfPeople: number;
  perPerson?: {
    amount: number;
    tip: number;
    total: number;
  };
  currencySymbol: string;
  currencyCode: string;
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
}

export type TipAction =
  | { type: 'UPDATE_TIP_OPTIONS'; payload: TipOptionState }
  | { type: 'RESET_TIP_OPTIONS_TO_DEFAULT'; payload: TipOptionState[] };

export type SplitAction =
  | { type: 'UPDATE_SPLIT_OPTIONS'; payload: SplitOptionState }
  | { type: 'RESET_SPLIT_OPTIONS_TO_DEFAULT'; payload: SplitOptionState[] };

export type CurrencyConfigAction = { type: 'UPDATE_CURRENCY_SIGN'; payload: CurrencyType };

export type SavedTipAction =
  | { type: 'SAVE_TIP'; payload: SavedTip }
  | { type: 'DELETE_TIP'; payload: string }
  | { type: 'CLEAR_ALL_TIPS' };

export type DuplicatePreventionAction = {
  type: 'UPDATE_DUPLICATE_PREVENTION_WINDOW';
  payload: number;
};

export type LanguageAction = {
  type: 'SET_LANGUAGE';
  payload: { language: string; isRTL: boolean };
};

export type AppAction =
  | TipAction
  | SplitAction
  | CurrencyConfigAction
  | SavedTipAction
  | DuplicatePreventionAction
  | LanguageAction
  | { type: 'LOAD_PERSISTED_STATE'; payload: AppState }; // Include LOAD_PERSISTED_STATE
