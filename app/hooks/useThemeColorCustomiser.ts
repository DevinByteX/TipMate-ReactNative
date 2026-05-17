import { UnistylesRuntime, UnistylesTheme, UnistylesThemes } from 'react-native-unistyles';
import type { CustomisedTheme } from '@/utils/themeStorage';

export type { CustomisedTheme };

export const useThemeColorCustomiser = (themes: CustomisedTheme[]): void => {
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
          ...customColors, // Merge the new colours for each theme
        },
      }),
    );
  });
};
