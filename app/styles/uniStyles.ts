import { UnistylesRegistry } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import { lightTheme, darkTheme, premiumTheme } from './themes';
import { getUserPreferredTheme } from '@hooks';

// Define types for breakpoints and themes
type AppBreakpoints = typeof breakpoints;
type AppThemes = {
    light: typeof lightTheme;
    dark: typeof darkTheme;
    premium: typeof premiumTheme;
};

// Extend the Unistyles interfaces
declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes { }
    export interface UnistylesBreakpoints extends AppBreakpoints { }
}

// For a basic setup without async storage (without using persisted user preferred theme), just add below code:
// Note: This setup does not need to be wrapped in a self-executing function
UnistylesRegistry
    .addThemes({
        light: lightTheme,
        dark: darkTheme,
        premium: premiumTheme,
    })
    .addBreakpoints(breakpoints)
    .addConfig({
        initialTheme: 'light', // Default initial theme
        adaptiveThemes: false, // Change to true for system theme adaptation
    });

/**
// Self-executing async function for setting up UnistylesRegistry for using persisted user preferred theme
(async () => {
    try {
        const initialTheme = await getUserPreferredTheme();
        UnistylesRegistry
            .addThemes({
                light: lightTheme,
                dark: darkTheme,
                premium: premiumTheme,
            })
            .addBreakpoints(breakpoints)
            .addConfig({
                initialTheme: initialTheme,
                adaptiveThemes: false, // Set to true if you want to adapt to system theme
            });
    } catch (error) {
        console.log('Error setting up Unistyles:', error);
    }
})();
*/
