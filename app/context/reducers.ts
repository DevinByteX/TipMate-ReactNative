import { CurrencyType } from '@configs';
import {
  SplitOptionState,
  SplitAction,
  TipOptionState,
  TipAction,
  CurrencyConfigAction,
  SavedTip,
  SavedTipAction,
  DuplicatePreventionAction,
  LanguageAction,
  ActiveSplitConfig,
  SplitConfigAction,
  SavedSplitPreset,
  SavedSplitPresetAction,
} from './types';

export const tipReducer = (state: TipOptionState[], action: TipAction): TipOptionState[] => {
  switch (action.type) {
    case 'UPDATE_TIP_OPTIONS':
      const updatedTips = state.map(tip =>
        tip.place === action.payload.place ? action.payload : tip,
      );
      return updatedTips;
    case 'RESET_TIP_OPTIONS_TO_DEFAULT':
      const defaultTipOptionsPayload = action.payload;
      return defaultTipOptionsPayload;
    default:
      return state;
  }
};

export const splitReducer = (
  state: SplitOptionState[],
  action: SplitAction,
): SplitOptionState[] => {
  switch (action.type) {
    case 'UPDATE_SPLIT_OPTIONS':
      const updatedSplits = state.map(split =>
        split.place === action.payload.place ? action.payload : split,
      );
      return updatedSplits;
    case 'RESET_SPLIT_OPTIONS_TO_DEFAULT':
      const defaultSplitOptionsPayload = action.payload;
      return defaultSplitOptionsPayload;
    default:
      return state;
  }
};

export const currencyConfigReducer = (
  state: CurrencyType | undefined,
  action: CurrencyConfigAction,
): CurrencyType | undefined => {
  switch (action.type) {
    case 'UPDATE_CURRENCY_SIGN':
      const updatedCurrencyConfig = action.payload;
      return updatedCurrencyConfig;
    case 'RESET_CURRENCY_TO_SYSTEM':
      return undefined;
    default:
      return state;
  }
};

export const savedTipsReducer = (state: SavedTip[], action: SavedTipAction): SavedTip[] => {
  switch (action.type) {
    case 'SAVE_TIP':
      const newTips = [action.payload, ...state];
      return newTips;
    case 'DELETE_TIP':
      const filteredTips = state.filter(tip => tip.id !== action.payload);
      return filteredTips;
    case 'CLEAR_ALL_TIPS':
      return [];
    default:
      return state;
  }
};

export const duplicatePreventionReducer = (
  state: number,
  action: DuplicatePreventionAction,
): number => {
  switch (action.type) {
    case 'UPDATE_DUPLICATE_PREVENTION_WINDOW':
      return action.payload;
    default:
      return state;
  }
};

export interface LanguageState {
  language: string | undefined;
  isRTL: boolean;
}

export const languageReducer = (
  state: LanguageState,
  action: LanguageAction,
): LanguageState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      const newLanguageState = {
        language: action.payload.language,
        isRTL: action.payload.isRTL,
      };
      return newLanguageState;
    case 'RESET_LANGUAGE_TO_SYSTEM':
      return { language: undefined, isRTL: false };
    default:
      return state;
  }
};

export const splitConfigReducer = (
  state: ActiveSplitConfig | undefined,
  action: SplitConfigAction,
): ActiveSplitConfig | undefined => {
  switch (action.type) {
    case 'SET_ACTIVE_SPLIT_CONFIG':
      return action.payload;
    case 'CLEAR_ACTIVE_SPLIT_CONFIG':
      return undefined;
    default:
      return state;
  }
};

export const savedSplitPresetsReducer = (
  state: SavedSplitPreset[],
  action: SavedSplitPresetAction,
): SavedSplitPreset[] => {
  switch (action.type) {
    case 'SAVE_SPLIT_PRESET':
      const afterSave = [action.payload, ...state];
      return afterSave;
    case 'UPDATE_SPLIT_PRESET':
      const afterUpdate = state.map(preset =>
        preset.id === action.payload.id ? action.payload : preset,
      );
      return afterUpdate;
    case 'DELETE_SPLIT_PRESET':
      const afterDelete = state.filter(preset => preset.id !== action.payload);
      return afterDelete;
    default:
      return state;
  }
};
