import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons, StyledToggle } from '@components';
import { setUserPreferredTheme, useThemeColorCustomiser } from '@hooks';
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
  const { styles, theme } = useStyles(stylesheet);

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
        }}>
        <View
          style={[
            styles.themeColorInnerBox,
            { backgroundColor: buttonColor || theme.colors.accent },
          ]}>
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
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.instructionText?.fontSize}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainBoxContainer}>
        {CustomThemesData.map(({ label, buttonColor, customisedTheme }) => (
          <ThemeColorBox
            key={label}
            buttonColor={buttonColor}
            onButtonPress={() => {
              useThemeColorCustomiser(customisedTheme);
            }}
          />
        ))}
      </View>
      <Text style={styles.toggleInstructionText}>
        <StyledIcons
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.toggleInstructionText?.fontSize}
        />
        {` ${toggleDescription}`}
      </Text>
      <View style={styles.mainThemeToggleContainer}>
        <Text style={styles.toggleText}>{`${toggleText}`}</Text>
        <StyledToggle
          value={UnistylesRuntime.themeName === 'dark'}
          onValueChange={value => {
            persistUserPreferredTheme(value);
            UnistylesRuntime.setTheme(value ? 'dark' : 'light');
          }}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
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
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainThemeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
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
    fontSize: 16,
  },
}));
