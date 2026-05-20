import { CurrencyType } from '@configs';
import { ActionTypes } from './actionTypes';
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
    case ActionTypes.UPDATE_TIP_OPTIONS:
      const updatedTips = state.map(tip =>
        tip.place === action.payload.place ? action.payload : tip,
      );
      return updatedTips;
    case ActionTypes.RESET_TIP_OPTIONS_TO_DEFAULT:
      return action.payload;
    default:
      return state;
  }
};

export const splitReducer = (
  state: SplitOptionState[],
  action: SplitAction,
): SplitOptionState[] => {
  switch (action.type) {
    case ActionTypes.UPDATE_SPLIT_OPTIONS:
      const updatedSplits = state.map(split =>
        split.place === action.payload.place ? action.payload : split,
      );
      return updatedSplits;
    case ActionTypes.RESET_SPLIT_OPTIONS_TO_DEFAULT:
      return action.payload;
    default:
      return state;
  }
};

export const currencyConfigReducer = (
  state: CurrencyType | undefined,
  action: CurrencyConfigAction,
): CurrencyType | undefined => {
  switch (action.type) {
    case ActionTypes.UPDATE_CURRENCY_SIGN:
      return action.payload;
    case ActionTypes.RESET_CURRENCY_TO_SYSTEM:
      return undefined;
    default:
      return state;
  }
};

export const savedTipsReducer = (state: SavedTip[], action: SavedTipAction): SavedTip[] => {
  switch (action.type) {
    case ActionTypes.SAVE_TIP:
      return [action.payload, ...state];
    case ActionTypes.DELETE_TIP:
      return state.filter(tip => tip.id !== action.payload);
    case ActionTypes.CLEAR_ALL_TIPS:
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
    case ActionTypes.UPDATE_DUPLICATE_PREVENTION_WINDOW:
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
    case ActionTypes.SET_LANGUAGE:
      return {
        language: action.payload.language,
        isRTL: action.payload.isRTL,
      };
    case ActionTypes.RESET_LANGUAGE_TO_SYSTEM:
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
    case ActionTypes.SET_ACTIVE_SPLIT_CONFIG:
      return action.payload;
    case ActionTypes.CLEAR_ACTIVE_SPLIT_CONFIG:
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
    case ActionTypes.SAVE_SPLIT_PRESET:
      return [action.payload, ...state];
    case ActionTypes.UPDATE_SPLIT_PRESET:
      return state.map(preset =>
        preset.id === action.payload.id ? action.payload : preset,
      );
    case ActionTypes.DELETE_SPLIT_PRESET:
      return state.filter(preset => preset.id !== action.payload);
    default:
      return state;
  }
};
