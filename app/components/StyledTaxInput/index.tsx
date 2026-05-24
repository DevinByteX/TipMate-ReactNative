import React, { useRef } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { useFocusScale } from '@hooks';
import { acceptNumbersAndDecimals, validateTaxInput } from '@utils';

export type TaxType = 'percentage' | 'amount';

type TypePillProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const TypePill = ({ label, active, onPress }: TypePillProps) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Pressable
      style={[
        styles.typePill,
        { backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.typePillText,
          { color: active ? theme.colors.card : theme.colors.card_typography },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

type StyledTaxInputProps = {
  titleText?: string;
  description?: string;
  taxType: TaxType;
  taxValue: string;
  currencySymbol?: string;
  billAmount?: string;
  onTaxTypeChange: (type: TaxType) => void;
  onTaxValueChange: (value: string) => void;
};

export const StyledTaxInput = ({
  titleText = 'TAX',
  description,
  taxType,
  taxValue,
  currencySymbol,
  billAmount,
  onTaxTypeChange,
  onTaxValueChange,
}: StyledTaxInputProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = React.useState(false);
  const { animatedStyle: focusAnimatedStyle } = useFocusScale(isFocused, 1.02);

  const isDisabled = !billAmount || parseFloat(billAmount) <= 0;

  const convertTaxValue = (toType: TaxType): string => {
    const numericValue = parseFloat(taxValue);
    const numericBill = parseFloat(billAmount ?? '0');
    if (!taxValue || isNaN(numericValue) || numericValue <= 0 || numericBill <= 0) return '';
    const converted =
      toType === 'percentage'
        ? (numericValue / numericBill) * 100
        : (numericValue / 100) * numericBill;
    const rounded = Math.round(converted * 100) / 100;
    return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    const { isValid, errorKey } = validateTaxInput(taxValue, taxType, billAmount);
    if (!isValid && errorKey) {
      Toast.show({ type: 'error', text1: t(errorKey) });
      onTaxValueChange('');
    }
  };

  const symbol = currencySymbol ?? '$';
  const isLongCurrencySymbol = symbol.length > 1;
  const prefix = taxType === 'amount' && !isLongCurrencySymbol ? symbol : '';
  const suffix = taxType === 'percentage' ? '%' : isLongCurrencySymbol ? symbol : '';

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{titleText}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
        />
        {description ? ` ${description}` : ''}
      </Text>

      {/* Tax value input with % / $ type switcher */}
      <Animated.View
        style={[styles.inputRow, focusAnimatedStyle, isDisabled && styles.disabledRow]}
        pointerEvents={isDisabled ? 'none' : 'auto'}
      >
        <View style={styles.typeToggleContainer}>
          <TypePill
            label="%"
            active={taxType === 'percentage'}
            onPress={() => {
              if (taxType !== 'percentage') {
                onTaxValueChange(convertTaxValue('percentage'));
                onTaxTypeChange('percentage');
              }
            }}
          />
          <TypePill
            label={symbol}
            active={taxType === 'amount'}
            onPress={() => {
              if (taxType !== 'amount') {
                onTaxValueChange(convertTaxValue('amount'));
                onTaxTypeChange('amount');
              }
            }}
          />
        </View>

        <View style={styles.textInputWrapper}>
          {prefix ? (
            <Text allowFontScaling={false} style={styles.affixText}>
              {prefix}
            </Text>
          ) : null}
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              { color: isFocused ? theme.colors.accent : theme.colors.card_typography },
            ]}
            value={taxValue}
            placeholder={'0.00'}
            placeholderTextColor={theme.colors.disable_text}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'number-pad'}
            returnKeyType={'done'}
            maxLength={8}
            allowFontScaling={false}
            editable={!isDisabled}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onChangeText={text => {
              const sanitised = acceptNumbersAndDecimals(text);
              onTaxValueChange(sanitised);
            }}
          />
          {suffix ? (
            <Text allowFontScaling={false} style={styles.affixText}>
              {suffix}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography }) => ({
  mainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingTop: (UnistylesRuntime.screen.height * 2) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1) / 100,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    columnGap: (UnistylesRuntime.screen.width * 3) / 100,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    columnGap: (UnistylesRuntime.screen.width * 1.5) / 100,
  },
  typePill: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 0.8) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
    height: (UnistylesRuntime.screen.height * 3.5) / 100,
  },
  typePillText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontFamily: fonts.Montserrat_Black,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
    borderRadius: (UnistylesRuntime.screen.height * 0.8) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
    height: (UnistylesRuntime.screen.height * 3.5) / 100,
  },
  affixText: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    marginHorizontal: 2,
  },
  disabledRow: {
    opacity: 0.4,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontFamily: fonts.Montserrat_Black,
    padding: 0,
  },
}));
