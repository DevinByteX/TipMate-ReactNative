import { useEffect, useState } from 'react';
import { UnistylesRuntime, UnistylesThemes } from "react-native-unistyles";
import { asyncStorageUtil } from "@hooks";
import { OptionValueType } from '@configs';

// Function to fetch user preferred theme from AsyncStorage
export const getUserPreferredTheme = async (): Promise<keyof UnistylesThemes> => {
    try {
        const theme = await asyncStorageUtil.getData('userPreferredTheme');
        if (theme === 'light' || theme === 'dark' || theme === 'premium') {
            return theme as keyof UnistylesThemes;
        }
    } catch (error) {
        console.log('Error fetching user theme from AsyncStorage:', error);
    }

    // Default to 'light' if theme is not valid or AsyncStorage error occurs
    return UnistylesRuntime.themeName;
};

export const setUserPreferredTheme = async (theme: keyof UnistylesThemes): Promise<void> => {
    try {
        await asyncStorageUtil.saveData('userPreferredTheme', theme);
    } catch (error) {
        console.log('Error setting user theme in AsyncStorage:', error);
    }
};

// Helper function to deep compare two arrays of objects
const deepEqual = (array1: OptionValueType[], array2: OptionValueType[]): boolean => {
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) return false;
    }
    return true;
};

export const useOptionValues = ({ asyncStorageKey, defaultOptionArray }: {
    asyncStorageKey: string;
    defaultOptionArray: OptionValueType[];
}): OptionValueType[] => {
    const [optionValues, setOptionValues] = useState<OptionValueType[]>([]);

    useEffect(() => {
        const fetchAndUpdateOptionValues = async () => {
            try {
                const storedOptionValues = await asyncStorageUtil.getData<OptionValueType[]>(asyncStorageKey);
                if (storedOptionValues && !deepEqual(storedOptionValues, defaultOptionArray)) {
                    // Update stored values to defaultOptionArray if they differ
                    await asyncStorageUtil.saveData(asyncStorageKey, defaultOptionArray);
                } else if (!storedOptionValues) {
                    // If no stored values, save defaultOptionArray
                    await asyncStorageUtil.saveData(asyncStorageKey, defaultOptionArray);
                }
                // Set optionValues to either stored or default values
                setOptionValues(storedOptionValues || defaultOptionArray);
            } catch (error) {
                console.log(`Error updating/fetching ${asyncStorageKey}:`, error);
                // In case of error, fallback to default values
                setOptionValues(defaultOptionArray);
                await asyncStorageUtil.saveData(asyncStorageKey, defaultOptionArray);
            }
        };

        fetchAndUpdateOptionValues();
    }, [asyncStorageKey, defaultOptionArray]);

    return optionValues;
};