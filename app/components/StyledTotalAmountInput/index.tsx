import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { acceptNumbersAndDecimals } from '@hooks';

type styledTotalAmountInputProps = {
  titleText?: string;
  description?: string;
  currencySymbol?: string;
  amountValue?: string;
  maxLength?: number;
  onAmountChange?: (value: number) => void;
} & TextInputProps;

export const StyledTotalAmountInput = ({
  titleText = 'TOTAL AMOUNT',
  description,
  currencySymbol,
  amountValue = '00.00',
  maxLength = 10,
  onAmountChange,
  ...restProps
}: styledTotalAmountInputProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const [textInputValue, setTextInputValue] = useState<string>();
  const [isFocused, setIsFocused] = useState<boolean>();

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.instructionText?.fontSize}
        />
        {` ${description}`}
      </Text>
      <View style={styles.textInputContainer}>
        {currencySymbol ? (
          <Text allowFontScaling={false} style={styles.currencySymbol}>{`${currencySymbol}`}</Text>
        ) : null}
        <TextInput
          placeholder={'0.00'}
          placeholderTextColor={
            isFocused
              ? theme.utils.hexToRGBA(styles.textInputStyles.color, 0.5)
              : styles.textInputStyles.color
          }
          value={textInputValue}
          autoFocus={true}
          caretHidden={false}
          selectionColor={theme.colors.accent}
          style={styles.textInputStyles}
          allowFontScaling={false}
          maxLength={maxLength}
          onChangeText={text => {
            const formattedValue = acceptNumbersAndDecimals(text);
            setTextInputValue(formattedValue);
            // Parse the formatted value to a float; default to 0.00 if empty
            const parsedValue = formattedValue.length > 0 ? parseFloat(formattedValue) : 0.0;
            // Invoke the callback with the parsed value, if the callback exists
            if (onAmountChange) {
              onAmountChange(parsedValue);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardAppearance={UnistylesRuntime.themeName === 'dark' ? 'dark' : 'light'}
          {...restProps}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  textInputContainer: {
    flexDirection: 'row',
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  currencySymbol: {
    color: colors.card_typography,
    fontSize: 40,
    fontFamily: fonts.Montserrat_Black,
  },
  textInputStyles: {
    flex: 1,
    width: '100%',
    color: colors.card_typography,
    fontSize: 40,
    fontFamily: fonts.Montserrat_Black,
    paddingVertical: 0, // To remove android hidden padding issue
  },
}));
