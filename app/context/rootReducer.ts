import { AppState, AppAction } from './types';
import { tipReducer, splitReducer, currencyConfigReducer, savedTipsReducer, duplicatePreventionReducer } from './reducers';
import { Constants } from '@configs';

export const rootReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        tips: action.payload.tips || state.tips,
        splits: action.payload.splits || state.splits,
        currencyConfig: action.payload.currencyConfig || state.currencyConfig,
        savedTips: action.payload.savedTips || state.savedTips,
        duplicatePreventionWindow: action.payload.duplicatePreventionWindow || state.duplicatePreventionWindow,
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
      return { ...state, currencyConfig: currencyConfigReducer(state.currencyConfig, action) };
    case 'SAVE_TIP':
    case 'DELETE_TIP':
    case 'CLEAR_ALL_TIPS':
      return { ...state, savedTips: savedTipsReducer(state.savedTips, action) };
    case 'UPDATE_DUPLICATE_PREVENTION_WINDOW':
      return { ...state, duplicatePreventionWindow: duplicatePreventionReducer(state.duplicatePreventionWindow, action) };
    default:
      return state;
  }
};
