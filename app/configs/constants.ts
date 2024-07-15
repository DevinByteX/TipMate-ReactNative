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
    defaultTipOptionsArray: [
        { place: 1, value: 5 },
        { place: 2, value: 10 },
        { place: 3, value: 15 },
        { place: 4, value: 20 },
    ] as OptionValueType[],
};