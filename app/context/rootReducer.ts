import { AppState, AppAction } from './types';
import { tipReducer, splitReducer } from './reducers';

export const rootReducer = (state: AppState, action: AppAction): AppState => ({
    tips: tipReducer(state.tips, action as any),
    splits: splitReducer(state.splits, action as any),
});
