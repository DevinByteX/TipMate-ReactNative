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
    | { type: 'UPDATE_TIP_OPTIONS'; payload: TipOptionState }
    | { type: 'LOAD_TIP_OPTIONS'; payload: TipOptionState[] };

export type SplitAction =
    | { type: 'UPDATE_SPLIT_OPTIONS'; payload: SplitOptionState }
    | { type: 'LOAD_SPLIT_OPTIONS'; payload: SplitOptionState[] };

export type AppAction =
    | TipAction
    | SplitAction
    | { type: 'LOAD_PERSISTED_STATE'; payload: AppState }; // Include LOAD_PERSISTED_STATE
