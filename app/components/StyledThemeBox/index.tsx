import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { StyledIcons, StyledToggle } from '@components';
import { setUserPreferredTheme, setUserUpdatedThemeOption, useThemeColorCustomiser } from '@hooks';
import { CustomThemesConfig } from '@configs';

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
  const { theme, rt } = useUnistyles();

  const CustomThemesData = CustomThemesConfig();

  const persistUserPreferredTheme = async (value: boolean) => {
    await setUserPreferredTheme(value ? 'dark' : 'light');
  };

  const ThemeColorBox = ({
    buttonColor,
    onButtonPress,
  }: {
    buttonColor?: string;
    onButtonPress?: () => void;
  }) => {
    const active = buttonColor == theme.colors.accent;

    return (
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
              useThemeColorCustomiser(customisedTheme);
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
        <Text style={styles.toggleText}>{`${toggleText}`}</Text>
        <StyledToggle
          value={rt.themeName === 'dark'}
          onValueChange={value => {
            persistUserPreferredTheme(value);
            UnistylesRuntime.setTheme(value ? 'dark' : 'light');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, fonts }, rt) => ({
  mainContainer: {
    marginTop: (rt.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (rt.screen.height * 2) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (rt.screen.height * 0.5) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  mainBoxContainer: {
    flexDirection: 'row',
    paddingVertical: (rt.screen.height * 1) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
    columnGap: (rt.screen.width * 2) / 100,
  },
  toggleInstructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (rt.screen.height * 0.5) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  mainThemeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (rt.screen.height * 0.5) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  toggleText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  themeColorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card_typography,
    width: '100%',
    height: (rt.screen.height * 4) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
    padding: StyleSheet.hairlineWidth * 2,
  },
  themeColorInnerBox: {
    backgroundColor: colors.accent,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (rt.screen.height * 0.9) / 100,
    borderWidth: StyleSheet.hairlineWidth * 6,
    borderColor: colors.card,
  },
  themeColorIcon: {
    color: colors.card_typography,
    fontSize: 16,
  },
}));
