export interface TipOptionState {
    place: number;
    value: number;
}

export interface SplitOptionState {
    place: number;
    value: number;
}

export interface AppState {
    tips: TipOptionState[];
    splits: SplitOptionState[];
}

export type TipAction =
    | { type: 'SET_TIP_OPTIONS'; payload: TipOptionState }
    | { type: 'UPDATE_TIP_OPTIONS'; payload: TipOptionState };

export type SplitAction =
    | { type: 'SET_SPLIT_OPTIONS'; payload: SplitOptionState }
    | { type: 'UPDATE_SPLIT_OPTIONS'; payload: SplitOptionState };

export type AppAction = TipAction | SplitAction;
