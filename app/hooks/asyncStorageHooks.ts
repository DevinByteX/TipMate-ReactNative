import { UnistylesRuntime, UnistylesThemes } from "react-native-unistyles";
import { asyncStorageUtil, CustomisedTheme } from "@hooks";

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

export const getUserUpdatedThemeOption = async (): Promise<CustomisedTheme[]> => {
    let updatedThemeName: CustomisedTheme[] = [];
    try {
        const result = await asyncStorageUtil.getData('userUpdatedTheme');
        if (result) {
            updatedThemeName = result as CustomisedTheme[];
        }
    } catch (error) {
        console.log('Error fetching user updated theme option from AsyncStorage:', error);
    }
    return updatedThemeName;
};

export const setUserUpdatedThemeOption = async (themes: CustomisedTheme[]): Promise<void> => {
    try {
        await asyncStorageUtil.saveData('userUpdatedTheme', themes);
    } catch (error) {
        console.log('Error setting user updated theme option in AsyncStorage:', error);
    }
};