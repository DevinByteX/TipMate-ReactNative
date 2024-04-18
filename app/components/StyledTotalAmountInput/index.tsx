import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

type styledTotalAmountInputProps = {
  titleText?: string;
  currencyText?: string;
  amountValue?: string;
  maxLength?: number;
} & TextInputProps;

export const StyledTotalAmountInput = ({
  titleText = 'TOTAL AMOUNT',
  currencyText = '$',
  amountValue = '00.00',
  maxLength = 10,
  ...restProps
}: styledTotalAmountInputProps) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <View style={styles.textInputContainer}>
        <Text style={styles.currencyText}>{`${currencyText}`}</Text>
        <TextInput
          value={amountValue}
          autoFocus
          style={styles.textInputStyles}
          selectionColor={theme.colors.primary_accent}
          cursorColor={theme.colors.primary_accent}
          allowFontScaling={false}
          maxLength={maxLength}
          {...restProps}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
  },
  textInputContainer: {
    flexDirection: 'row',
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  currencyText: {
    color: colors.card_typography,
    fontSize: 40,
    fontWeight: '800',
  },
  textInputStyles: {
    flex: 1,
    width: '100%',
    color: colors.card_typography,
    fontSize: 40,
    fontWeight: '800',
    paddingVertical: 0, // To remove android hidden padding issue
  },
}));
