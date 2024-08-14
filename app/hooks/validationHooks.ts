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

export const areOptionArraysSame = ({ firstArray, secondArray }: {
    firstArray: SplitOptionState[] | TipOptionState[];
    secondArray: SplitOptionState[] | TipOptionState[];
}): boolean => {
    if (firstArray.length !== secondArray.length) {
        return false;
    }

    // Sort the arrays by a unique property to ensure order doesn't matter
    const sortedFirstArray = firstArray.sort((a, b) => a.place - b.place);
    const sortedSecondArray = secondArray.sort((a, b) => a.place - b.place);

    // Compare each object deeply
    return sortedFirstArray.every((obj1, index) => {
        const obj2 = sortedSecondArray[index];
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    });
};