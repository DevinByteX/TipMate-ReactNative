import { StyleSheet } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import { lightTheme, darkTheme, premiumTheme } from './themes';
import { Constants } from '@configs';

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

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
    premium: premiumTheme,
  },
  breakpoints: breakpoints,
  settings: {
    initialTheme: Constants.defaultColorTheme, // Default initial theme (should add this if adaptiveThemes:false)
    adaptiveThemes: false, // Change to true for system theme adaptation
  },
})
