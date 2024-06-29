import { useEffect, useState } from 'react';
import { UnistylesRuntime, UnistylesThemes } from "react-native-unistyles";
import { asyncStorageUtil } from "@hooks";

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

export type OptionValueType = {
    place: number;
    value: number;
}

export const useOptionValues = ({ asyncStorageKey, defaultOptionArray }: {
    asyncStorageKey: string;
    defaultOptionArray: OptionValueType[];
}): OptionValueType[] => {

    const [optionValues, setOptionValues] = useState<OptionValueType[]>([]);

    useEffect(() => {
        const fetchOptionValues = async () => {
            try {
                const storedOptionValues = await asyncStorageUtil.getData<OptionValueType[]>(asyncStorageKey);
                if (storedOptionValues) {
                    setOptionValues(storedOptionValues);
                } else {
                    setOptionValues(defaultOptionArray);
                    await asyncStorageUtil.saveData(asyncStorageKey, defaultOptionArray);
                }
            } catch (error) {
                console.log(`Error fetching ${asyncStorageKey}:`, error);
            }
        };

        fetchOptionValues();
    }, []);

    return optionValues;
};
