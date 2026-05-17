import { UnistylesRuntime, UnistylesThemes } from 'react-native-unistyles';
import type { CustomisedTheme } from './themeStorage';

/**
 * Applies colour overrides to the active Unistyles theme registry.
 * Not a React hook — safe to call outside of component render (e.g. inside effects or callbacks).
 */
export const applyThemeColors = (themes: CustomisedTheme[]): void => {
    if (
        !Array.isArray(themes) ||
        themes.some(
            theme => typeof theme.themeName !== 'string' || typeof theme.customColors !== 'object',
        )
    ) {
        console.log('Invalid theme configuration provided');
        return;
    }

    themes.forEach(({ themeName, customColors }) => {
        UnistylesRuntime.updateTheme(
            themeName,
            (currentTheme: UnistylesThemes[keyof UnistylesThemes]) => ({
                ...currentTheme,
                colors: {
                    ...currentTheme.colors,
                    ...customColors,
                },
            }),
        );
    });
};
