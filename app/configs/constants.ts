export type OptionValueType = {
    place: number;
    value: number;
};

export const Constants = {
    defaultSplitOptionsArray: [
        { place: 1, value: 1 },
        { place: 2, value: 3 },
        { place: 3, value: 5 },
        { place: 4, value: 7 },
    ] as OptionValueType[],
    SPLIT_OPTIONS_ARRAY_STORAGE_KEY: 'splitOptionsArray'
};