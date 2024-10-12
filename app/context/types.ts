import { CurrencyType } from "@configs";

export interface TipOptionState {
    place: number;
    value: number;
}

export interface SplitOptionState {
    place: number;
    value: number;
}

export interface TipSliderConfigValues {
    min: number;
    max: number;
    step: number;
}

export interface SplitSliderConfigValues {
    min: number;
    max: number;
    step: number;
}
export interface AppState {
    tips: TipOptionState[];
    splits: SplitOptionState[];
    tipSliderConfig: TipSliderConfigValues;
    splitSliderConfig: SplitSliderConfigValues;
    currencyConfig: CurrencyType;
}

export type TipAction =
    | { type: 'UPDATE_TIP_OPTIONS'; payload: TipOptionState }
    | { type: 'RESET_TIP_OPTIONS_TO_DEFAULT'; payload: TipOptionState[] };

export type SplitAction =
    | { type: 'UPDATE_SPLIT_OPTIONS'; payload: SplitOptionState }
    | { type: 'RESET_SPLIT_OPTIONS_TO_DEFAULT'; payload: SplitOptionState[] };

export type CurrencyConfigAction = { type: 'UPDATE_CURRENCY_SIGN'; payload: CurrencyType };

export type AppAction =
    | TipAction
    | SplitAction
    | CurrencyConfigAction
    | { type: 'LOAD_PERSISTED_STATE'; payload: AppState }; // Include LOAD_PERSISTED_STATE
