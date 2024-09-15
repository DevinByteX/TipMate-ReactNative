import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';

export const StyledCurrencySelector = ({
  title,
  description,
  currencyChangeInstructionText,
  currencyText,
}: {
  title: string;
  description: string;
  currencyChangeInstructionText: string;
  currencyText: string;
}) => {
  const { styles } = useStyles(stylesheet);
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
      <View style={styles.mainCurrencyChangeContainer}>
        <Text style={styles.currencyChangeText}>{`${currencyChangeInstructionText}`}</Text>
        <View style={styles.currencyBox}>
          <Text style={styles.currencyText}>{`${currencyText}`}</Text>
        </View>
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
  mainCurrencyChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  currencyChangeText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  currencyBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (UnistylesRuntime.screen.width * 20) / 100,
    backgroundColor: colors.backgroundColor,
    height: (UnistylesRuntime.screen.height * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  currencyText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },
}));
