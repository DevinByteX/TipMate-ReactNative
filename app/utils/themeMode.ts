import { UnistylesThemes } from 'react-native-unistyles';

export type ThemeName = keyof UnistylesThemes;
export type ThemePalette = 'default' | 'sky';

/**
 * Helpers to resolve the base theme from two independent choices:
 * the colour palette ('default' | 'sky') and whether dark mode is on.
 * Keeps the existing binary dark-mode toggle working across palettes.
 */
export const isDarkThemeName = (name: ThemeName): boolean => name === 'dark' || name === 'skyDark';

export const getThemePalette = (name: ThemeName): ThemePalette =>
  name === 'sky' || name === 'skyDark' ? 'sky' : 'default';

export const composeThemeName = (palette: ThemePalette, isDark: boolean): ThemeName => {
  if (palette === 'sky') {
    return isDark ? 'skyDark' : 'sky';
  }
  return isDark ? 'dark' : 'light';
};
