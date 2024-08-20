import { SplitOptionState, SplitSliderConfigValues, TipOptionState, TipSliderConfigValues } from "@/context/types";

export const Constants = {
    defaultSplitOptionsArray: [
        { place: 1, value: 1 },
        { place: 2, value: 3 },
        { place: 3, value: 5 },
        { place: 4, value: 7 },
    ] as SplitOptionState[],
    defaultTipOptionsArray: [
        { place: 1, value: 5 },
        { place: 2, value: 10 },
        { place: 3, value: 15 },
        { place: 4, value: 20 },
    ] as TipOptionState[],
    APP_STATE_ASYNCSTORAGE_KEY: 'APPSTATE' as string,
    defaultSplitSliderConfigValues: {
        min: 1,
        max: 15,
        step: 1
    } as SplitSliderConfigValues,
    defaultTipSliderConfigValues: {
        min: 0,
        max: 80,
        step: 1
    } as TipSliderConfigValues
};