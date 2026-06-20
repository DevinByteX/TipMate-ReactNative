import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons, StyledToggle } from '@components';
import { useTranslation } from 'react-i18next';
import {
  setUserPreferredTheme,
  setUserUpdatedThemeOption,
  applyThemeColors,
  composeThemeName,
  getThemePalette,
  isDarkThemeName,
  ThemeName,
  ThemePalette,
} from '@utils';
import { useCustomThemesConfig } from '@configs';
import { useScaleSpring } from '@hooks';

export const StyledThemeBox = ({
  title,
  description,
  toggleDescription,
  toggleText,
}: {
  title: string;
  description: string;
  toggleDescription?: string;
  toggleText?: string;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();

  const CustomThemesData = useCustomThemesConfig();

  const currentTheme = UnistylesRuntime.themeName as ThemeName;

  // Applies a base theme and persists it as the user's preference.
  const applyBaseTheme = async (themeName: ThemeName) => {
    UnistylesRuntime.setTheme(themeName);
    await setUserPreferredTheme(themeName);
  };

  // Dark-mode toggle keeps the current palette (default, sky or rose).
  const onToggleDarkMode = (value: boolean) => {
    applyBaseTheme(composeThemeName(getThemePalette(currentTheme), value));
  };

  // Palette selector keeps the current dark/light state.
  const onSelectPalette = (palette: ThemePalette) => {
    applyBaseTheme(composeThemeName(palette, isDarkThemeName(currentTheme)));
  };

  const activePalette = getThemePalette(currentTheme);
  const palettes: { key: ThemePalette; label: string; color: string }[] = [
    { key: 'default', label: t('components.themeBox.paletteDefault'), color: '#009688' },
    { key: 'sky', label: t('components.themeBox.paletteSky'), color: '#0369a1' },
    { key: 'rose', label: t('components.themeBox.paletteRose'), color: '#db2777' },
  ];

  const ThemeColorBox = ({
    buttonColor,
    onButtonPress,
  }: {
    buttonColor?: string;
    onButtonPress?: () => void;
  }) => {
    const active = buttonColor == theme.colors.accent;
    const { animatedStyle } = useScaleSpring(active);

    return (
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Pressable
          style={[
            styles.themeColorBox,
            { backgroundColor: active ? theme.colors.card_typography : theme.colors.card },
          ]}
          onPress={() => {
            onButtonPress && onButtonPress();
          }}
        >
          <View
            style={[
              styles.themeColorInnerBox,
              { backgroundColor: buttonColor || theme.colors.accent },
            ]}
          >
            {active ? (
              <StyledIcons type={'Octicons'} name={'check'} style={styles.themeColorIcon} />
            ) : null}
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${title}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainBoxContainer}>
        {CustomThemesData.map(({ label, buttonColor, customisedTheme }) => (
          <ThemeColorBox
            key={label}
            buttonColor={buttonColor}
            onButtonPress={() => {
              // Setting theme option
              applyThemeColors(customisedTheme);
              // Persisting theme option
              setUserUpdatedThemeOption(customisedTheme);
            }}
          />
        ))}
      </View>
      <Text style={styles.toggleInstructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.toggleInstructionText?.fontSize}
          color={styles.toggleInstructionText?.color}
        />
        {` ${toggleDescription}`}
      </Text>
      <View style={styles.mainThemeToggleContainer}>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleText}>{`${toggleText}`}</Text>
        </View>
        <View style={styles.toggleButtonContainer}>
          <StyledToggle value={isDarkThemeName(currentTheme)} onValueChange={onToggleDarkMode} />
        </View>
      </View>
      <Text style={styles.toggleInstructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.toggleInstructionText?.fontSize}
          color={styles.toggleInstructionText?.color}
        />
        {` ${t('components.themeBox.paletteDescription')}`}
      </Text>
      <View style={styles.paletteRow}>
        {palettes.map(({ key, label, color }) => {
          const active = activePalette === key;
          return (
            <Pressable
              key={key}
              style={[
                styles.paletteItem,
                { borderColor: active ? theme.colors.accent : 'transparent' },
              ]}
              onPress={() => onSelectPalette(key)}
            >
              <View style={[styles.paletteSwatch, { backgroundColor: color }]}>
                {active ? (
                  <StyledIcons type={'Octicons'} name={'check'} style={styles.paletteSwatchIcon} />
                ) : null}
              </View>
              <Text style={styles.paletteLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography }) => ({
  mainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainBoxContainer: {
    flexDirection: 'row',
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    columnGap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  toggleInstructionText: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainThemeToggleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  toggleTextContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  toggleText: {
    color: colors.card_typography,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Black,
  },
  toggleButtonContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  paletteRow: {
    flexDirection: 'row',
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    columnGap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  paletteItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderWidth: UnistylesRuntime.hairlineWidth * 6,
    backgroundColor: colors.backgroundColor,
  },
  paletteSwatch: {
    width: (UnistylesRuntime.screen.height * 3.5) / 100,
    height: (UnistylesRuntime.screen.height * 3.5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 3.5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paletteSwatchIcon: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  paletteLabel: {
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    color: colors.card_typography,
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontFamily: fonts.Nunito_Bold,
  },
  themeColorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card_typography,
    width: '100%',
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    padding: UnistylesRuntime.hairlineWidth * 2,
  },
  themeColorInnerBox: {
    backgroundColor: colors.accent,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 0.9) / 100,
    borderWidth: UnistylesRuntime.hairlineWidth * 6,
    borderColor: colors.card,
  },
  themeColorIcon: {
    color: colors.card_typography,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
  },
}));
