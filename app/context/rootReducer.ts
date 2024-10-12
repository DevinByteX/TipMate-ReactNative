import { AppState, AppAction } from './types';
import { tipReducer, splitReducer, currencyConfigReducer } from './reducers';
import { Constants } from '@configs';

export const rootReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'LOAD_PERSISTED_STATE':
            return {
                ...state,
                tips: action.payload.tips || state.tips,
                splits: action.payload.splits || state.splits,
                currencyConfig: action.payload.currencyConfig || state.currencyConfig,
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
        default:
            return state;
    }
};
