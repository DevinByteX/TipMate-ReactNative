import { SplitOptionState, TipOptionState } from "@/context/types";

export const validateOptionValues = ({
    place,
    newValue,
    optionsArray,
    minValue,
    maxValue,
}: {
    place: number;
    newValue: number;
    optionsArray: SplitOptionState[] | TipOptionState[];
    minValue: number;
    maxValue: number;
}) => {
    const errorMessages = [];

    // Validate the new value is between minValue and maxValue
    if (newValue < minValue || newValue > maxValue) {
        errorMessages.push(`Value must be between ${minValue} and ${maxValue}.`);
    }

    // Validate the new value is unique
    if (optionsArray.some(option => option.value === newValue && option.place !== place)) {
        errorMessages.push('Value must be unique.');
    }

    return errorMessages;
};