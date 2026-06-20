import { UnistylesThemes } from 'react-native-unistyles';

export type ThemeName = keyof UnistylesThemes;
export type ThemePalette = 'default' | 'sky' | 'rose' | 'electric' | 'mocha';

/**
 * Helpers to resolve the base theme from two independent choices:
 * the colour palette ('default' | 'sky' | 'rose' | 'electric' | 'mocha') and whether dark mode is on.
 * Keeps the existing binary dark-mode toggle working across palettes.
 */
export const isDarkThemeName = (name: ThemeName): boolean =>
  name === 'dark' ||
  name === 'skyDark' ||
  name === 'roseDark' ||
  name === 'electricDark' ||
  name === 'mochaDark';

export const getThemePalette = (name: ThemeName): ThemePalette => {
  if (name === 'sky' || name === 'skyDark') {
    return 'sky';
  }
  if (name === 'rose' || name === 'roseDark') {
    return 'rose';
  }
  if (name === 'electric' || name === 'electricDark') {
    return 'electric';
  }
  if (name === 'mocha' || name === 'mochaDark') {
    return 'mocha';
  }
  return 'default';
};

export const composeThemeName = (palette: ThemePalette, isDark: boolean): ThemeName => {
  switch (palette) {
    case 'sky':
      return isDark ? 'skyDark' : 'sky';
    case 'rose':
      return isDark ? 'roseDark' : 'rose';
    case 'electric':
      return isDark ? 'electricDark' : 'electric';
    case 'mocha':
      return isDark ? 'mochaDark' : 'mocha';
    default:
      return isDark ? 'dark' : 'light';
  }
};
