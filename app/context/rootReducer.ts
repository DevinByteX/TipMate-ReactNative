import { AppState, AppAction } from './types';
import { tipReducer, splitReducer } from './reducers';

export const rootReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'LOAD_PERSISTED_STATE':
            return {
                ...state,
                tips: action.payload.tips,
                splits: action.payload.splits,
            };

        case 'UPDATE_TIP_OPTIONS':
        case 'LOAD_TIP_OPTIONS':
            return {
                ...state,
                tips: tipReducer(state.tips, action),
            };

        case 'UPDATE_SPLIT_OPTIONS':
        case 'LOAD_SPLIT_OPTIONS':
            return {
                ...state,
                splits: splitReducer(state.splits, action),
            };

        default:
            return state;
    }
};
