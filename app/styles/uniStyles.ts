import { UnistylesRegistry } from 'react-native-unistyles';
import { breakpoints } from './breakpoints';
import {
  lightTheme,
  darkTheme,
  premiumTheme,
  skyTheme,
  skyDarkTheme,
  roseTheme,
  roseDarkTheme,
  electricTheme,
  electricDarkTheme,
} from './themes';

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
  premium: typeof premiumTheme;
  sky: typeof skyTheme;
  skyDark: typeof skyDarkTheme;
  rose: typeof roseTheme;
  roseDark: typeof roseDarkTheme;
  electric: typeof electricTheme;
  electricDark: typeof electricDarkTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

UnistylesRegistry.addThemes({
  light: lightTheme,
  dark: darkTheme,
  premium: premiumTheme,
  sky: skyTheme,
  skyDark: skyDarkTheme,
  rose: roseTheme,
  roseDark: roseDarkTheme,
  electric: electricTheme,
  electricDark: electricDarkTheme,
})
  .addBreakpoints(breakpoints)
  .addConfig({
    initialTheme: 'light', // Default initial theme (should add this if adaptiveThemes:false)
    adaptiveThemes: false, // Change to true for system theme adaptation
  });
