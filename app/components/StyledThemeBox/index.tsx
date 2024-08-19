import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';

export const StyledThemeBox = ({ title, description }: { title: string; description: string }) => {
  const { styles, theme } = useStyles(stylesheet);

  const ThemeColorBox = ({
    active = false,
    buttonColor,
  }: {
    active?: boolean;
    buttonColor?: string;
  }) => {
    return (
      <View
        style={[
          styles.themeColorBox,
          { backgroundColor: active ? theme.colors.card_typography : theme.colors.card },
        ]}>
        <View
          style={[
            styles.themeColorInnerBox,
            { backgroundColor: buttonColor || theme.colors.accent },
          ]}>
          {active ? (
            <StyledIcons type={'Octicons'} name={'check'} style={styles.themeColorIcon} />
          ) : null}
        </View>
      </View>
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
      <View style={styles.mainInnerContainer}>
        <ThemeColorBox active />
        <ThemeColorBox />
        <ThemeColorBox />
        <ThemeColorBox />
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
  mainInnerContainer: {
    flexDirection: 'row',
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    columnGap: (UnistylesRuntime.screen.width * 2) / 100,
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
