import { AppState, AppAction } from './types';
import { tipReducer, splitReducer, currencyConfigReducer, savedTipsReducer, duplicatePreventionReducer, languageReducer, splitConfigReducer } from './reducers';
import { Constants } from '@configs';

export const rootReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
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
      };
    case 'UPDATE_TIP_OPTIONS':
      return { ...state, tips: tipReducer(state.tips, action) };
    case 'RESET_TIP_OPTIONS_TO_DEFAULT':
      return { ...state, tips: Constants.defaultTipOptionsArray };
    case 'UPDATE_SPLIT_OPTIONS':
      return { ...state, splits: splitReducer(state.splits, action) };
    case 'RESET_SPLIT_OPTIONS_TO_DEFAULT':
      return { ...state, splits: Constants.defaultSplitOptionsArray };
    case 'UPDATE_CURRENCY_SIGN':
    case 'RESET_CURRENCY_TO_SYSTEM':
      return { ...state, currencyConfig: currencyConfigReducer(state.currencyConfig, action) };
    case 'SAVE_TIP':
    case 'DELETE_TIP':
    case 'CLEAR_ALL_TIPS':
      return { ...state, savedTips: savedTipsReducer(state.savedTips, action) };
    case 'UPDATE_DUPLICATE_PREVENTION_WINDOW':
      return { ...state, duplicatePreventionWindow: duplicatePreventionReducer(state.duplicatePreventionWindow, action) };
    case 'SET_LANGUAGE':
    case 'RESET_LANGUAGE_TO_SYSTEM':
      const newLanguageState = languageReducer({ language: state.language ?? undefined, isRTL: state.isRTL }, action);
      return { ...state, ...newLanguageState };
    case 'SET_ACTIVE_SPLIT_CONFIG':
    case 'CLEAR_ACTIVE_SPLIT_CONFIG':
      return { ...state, activeSplitConfig: splitConfigReducer(state.activeSplitConfig, action) };
    default:
      return state;
  }
};
