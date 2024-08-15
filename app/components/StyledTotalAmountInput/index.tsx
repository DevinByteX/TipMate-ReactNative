import { convertToTwoDecimalPoints } from '@/hooks';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';

type styledTotalAmountInputProps = {
  titleText?: string;
  currencyText?: string;
  amountValue?: string;
  maxLength?: number;
  onAmountChange?: (value: number) => void;
} & TextInputProps;

export const StyledTotalAmountInput = ({
  titleText = 'TOTAL AMOUNT',
  currencyText = '$',
  amountValue = '00.00',
  maxLength = 10,
  onAmountChange,
  ...restProps
}: styledTotalAmountInputProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const [textInputValue, setTextInputValue] = useState<string>();

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.instructionText?.fontSize}
        />
        {` ${'Pop in the total bill amount here – let’s get started!'}`}
      </Text>
      <View style={styles.textInputContainer}>
        <Text allowFontScaling={false} style={styles.currencyText}>{`${currencyText}`}</Text>
        <TextInput
          defaultValue={'0.00'}
          value={textInputValue?.length === 0 ? '0.00' : textInputValue}
          autoFocus={true}
          caretHidden={true}
          selectionColor={theme.colors.accent}
          style={styles.textInputStyles}
          allowFontScaling={false}
          maxLength={maxLength}
          onChangeText={text => {
            const formatedValue = convertToTwoDecimalPoints(text);
            setTextInputValue(formatedValue);
            onAmountChange && onAmountChange(parseFloat(formatedValue));
          }}
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
  currencyText: {
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
