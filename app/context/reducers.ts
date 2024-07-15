import { TipOptionState, TipAction, SplitOptionState, SplitAction } from './types';

export const tipReducer = (state: TipOptionState[], action: TipAction): TipOptionState[] => {
    switch (action.type) {
        case 'SET_TIP_OPTIONS':
            return { ...state, ...action.payload };
        case 'UPDATE_TIP_OPTIONS':
            return state.map(tip =>
                tip.place === action.payload.place ? action.payload : tip
            );
        default:
            return state;
    }
};

export const splitReducer = (state: SplitOptionState[], action: SplitAction): SplitOptionState[] => {
    switch (action.type) {
        case 'SET_SPLIT_OPTIONS':
            return { ...state, ...action.payload };
        case 'UPDATE_SPLIT_OPTIONS':
            return state.map(split =>
                split.place === action.payload.place ? action.payload : split
            );
        default:
            return state;
    }
};