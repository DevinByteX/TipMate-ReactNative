import { UnistylesRegistry } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import { lightTheme, darkTheme, premiumTheme } from './themes';
import { getUserPreferredTheme } from '@hooks';

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
    light: typeof lightTheme;
    dark: typeof darkTheme;
    premium: typeof premiumTheme;
};

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes { }
    export interface UnistylesBreakpoints extends AppBreakpoints { }
}

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
