import { UnistylesRuntime, UnistylesThemes } from "react-native-unistyles";
import { asyncStorageUtil } from "@hooks";
import { ThemeBox } from "@/configs";

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

export const getUserUpdatedThemeOption = async (themeOptions: ThemeBox[] | undefined): Promise<ThemeBox | undefined> => {
    if (!themeOptions || themeOptions.length === 0) {
        return undefined;
    }

    try {
        const updatedThemeName = await asyncStorageUtil.getData('userUpdatedThemeName');
        return themeOptions.find(datum => datum.label === updatedThemeName);
    } catch (error) {
        console.log('Error fetching user updated theme option from AsyncStorage:', error);
        return undefined; // Ensure that the function always returns `undefined` in case of an error
    }
};

export const setUserUpdatedThemeOption = async (themeName: string): Promise<void> => {
    try {
        await asyncStorageUtil.saveData('userUpdatedThemeName', themeName);
    } catch (error) {
        console.log('Error setting user updated theme option in AsyncStorage:', error);
    }
};