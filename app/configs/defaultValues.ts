import type {
    SplitOptionState,
    SplitSliderConfigValues,
    TipOptionState,
    TipSliderConfigValues,
} from '@/context/types';

export type DuplicatePreventionTimeOption = {
    value: number;
};

export const defaultSplitOptionsArray: SplitOptionState[] = [
    { place: 1, value: 1 },
    { place: 2, value: 3 },
    { place: 3, value: 5 },
    { place: 4, value: 7 },
];

export const defaultTipOptionsArray: TipOptionState[] = [
    { place: 1, value: 0 },
    { place: 2, value: 5 },
    { place: 3, value: 10 },
    { place: 4, value: 15 },
];

export const defaultSplitSliderConfigValues: SplitSliderConfigValues = {
    min: 1,
    max: 15,
    step: 1,
};

export const defaultTipSliderConfigValues: TipSliderConfigValues = {
    min: 0,
    max: 80,
    step: 1,
};

/** Default duplicate-prevention window in minutes. */
export const defaultDuplicatePreventionWindow = 15;

export const duplicatePreventionTimeOptions: DuplicatePreventionTimeOption[] = [
    { value: 0 },
    { value: 2 },
    { value: 5 },
    { value: 10 },
    { value: 15 },
    { value: 30 },
    { value: 45 },
    { value: 60 },
];
