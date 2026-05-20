import { AppState, AppAction } from './types';
import { tipReducer, splitReducer, currencyConfigReducer, savedTipsReducer, duplicatePreventionReducer, languageReducer, splitConfigReducer, savedSplitPresetsReducer } from './reducers';
import { Constants } from '@configs';
import { ActionTypes } from './actionTypes';

export const rootReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ActionTypes.LOAD_PERSISTED_STATE:
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
    case ActionTypes.UPDATE_TIP_OPTIONS:
      return { ...state, tips: tipReducer(state.tips, action) };
    case ActionTypes.RESET_TIP_OPTIONS_TO_DEFAULT:
      return { ...state, tips: Constants.defaultTipOptionsArray };
    case ActionTypes.UPDATE_SPLIT_OPTIONS:
      return { ...state, splits: splitReducer(state.splits, action) };
    case ActionTypes.RESET_SPLIT_OPTIONS_TO_DEFAULT:
      return { ...state, splits: Constants.defaultSplitOptionsArray };
    case ActionTypes.UPDATE_CURRENCY_SIGN:
    case ActionTypes.RESET_CURRENCY_TO_SYSTEM:
      return { ...state, currencyConfig: currencyConfigReducer(state.currencyConfig, action) };
    case ActionTypes.SAVE_TIP:
    case ActionTypes.DELETE_TIP:
    case ActionTypes.CLEAR_ALL_TIPS:
      return { ...state, savedTips: savedTipsReducer(state.savedTips, action) };
    case ActionTypes.UPDATE_DUPLICATE_PREVENTION_WINDOW:
      return { ...state, duplicatePreventionWindow: duplicatePreventionReducer(state.duplicatePreventionWindow, action) };
    case ActionTypes.SET_LANGUAGE:
    case ActionTypes.RESET_LANGUAGE_TO_SYSTEM:
      const newLanguageState = languageReducer({ language: state.language ?? undefined, isRTL: state.isRTL }, action);
      return { ...state, ...newLanguageState };
    case ActionTypes.SET_ACTIVE_SPLIT_CONFIG:
    case ActionTypes.CLEAR_ACTIVE_SPLIT_CONFIG:
      return { ...state, activeSplitConfig: splitConfigReducer(state.activeSplitConfig, action) };
    case ActionTypes.SAVE_SPLIT_PRESET:
    case ActionTypes.UPDATE_SPLIT_PRESET:
    case ActionTypes.DELETE_SPLIT_PRESET:
      return { ...state, savedSplitPresets: savedSplitPresetsReducer(state.savedSplitPresets, action) };
    default:
      return state;
  }
};
