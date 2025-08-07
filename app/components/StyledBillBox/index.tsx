import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';

// Vertical Devider Component
export const VerticalDevider = ({
  verticalDeviderAdditionalStyles,
}: {
  verticalDeviderAdditionalStyles?: ViewStyle;
}) => {
  return <View style={[styles.verticalDeviderStyles, verticalDeviderAdditionalStyles]} />;
};

type StyledBillBox = {
  titleVisibility?: boolean;
  titleText?: string;
  description?: string;
  currencySymbol?: string;
  totalText?: string;
  subTotalText?: string;
  tipText?: string;
  totalAmount?: string | number;
  subTotalAmount?: string | number;
  totalTipAmount?: string | number;
  shareButtonPress?: () => void;
};

export const StyledBillBox = ({
  titleVisibility = false,
  titleText = 'PER PERSON',
  description,
  currencySymbol,
  totalText = 'TOTAL',
  subTotalText = 'SUBTOTAL',
  tipText = 'TIP',
  totalAmount = '0.00',
  subTotalAmount = '0.00',
  totalTipAmount = '0.00',
  shareButtonPress,
}: StyledBillBox) => {
  const isLongCurrencySymbol: boolean =
    typeof currencySymbol === 'string' && currencySymbol.length > 1;

  const { theme } = useUnistyles();
  // Extract currency symbol rendering for title
  const renderTitleCurrencySymbol = () => {
    if (isLongCurrencySymbol) {
      return <Text style={styles.currencySymbol}>{` · ${currencySymbol}`}</Text>;
    }
    return null;
  };

  return (
    <View style={styles.superMainContainer}>
      {/* Title Row*/}
      <View style={styles.titleRowContainer}>
        <View style={styles.titleLeftContainer}>
          {titleVisibility && (
            <Text style={styles.titleText} numberOfLines={1}>
              {titleText}
              {renderTitleCurrencySymbol()}
            </Text>
          )}
        </View>
        <View style={styles.titleRightContainer}>
          <StyledIcons
            type={'Octicons'}
            name={'share'}
            size={styles.titleText?.fontSize + 5}
            color={Number(totalAmount) > 0 ? styles.titleText?.color : theme.colors.disable_button}
            disabled={Number(totalAmount) > 0 ? false : true}
            onPress={() => {
              shareButtonPress && shareButtonPress();
            }}
          />
        </View>
      </View>
      {/* Instruction Text */}
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.instructionText?.fontSize}
        />
        {` ${description}`}
      </Text>
      <View style={styles.mainInnerContainer}>
        {/* Total Text Content Container */}
        <View style={styles.totalAmountsContainer}>
          <Text style={styles.subTextStyles}>
            {totalText}
            {isLongCurrencySymbol ? (
              <Text style={{ color: theme.colors.card_typography }}>{` · ${currencySymbol}`}</Text>
            ) : null}
          </Text>
          <View style={styles.horizontalTextContainer}>
            <Text
              style={styles.totalDigitsStyles}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}
            >
              {!isLongCurrencySymbol ? <Text>{currencySymbol}</Text> : null}
              {totalAmount}
            </Text>
          </View>
        </View>
        {/* Vertical Devider */}
        <VerticalDevider />
        {/* Sub Total & Tip Text Content Container */}
        <View style={styles.subTotalAndTipAmountsContainer}>
          {/* Sub Total Text Container */}
          <View style={styles.subTotalContainer}>
            <Text
              style={styles.subTextStyles}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}
            >
              {subTotalText}
              {isLongCurrencySymbol ? (
                <Text
                  style={{ color: theme.colors.card_typography }}
                >{` · ${currencySymbol}`}</Text>
              ) : null}
            </Text>
            <View style={styles.horizontalTextContainer}>
              <Text
                style={styles.subDigitStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {!isLongCurrencySymbol ? <Text>{currencySymbol}</Text> : null}
                {subTotalAmount}
              </Text>
            </View>
          </View>
          {/* Tip Text Container */}
          <View style={styles.tipContainer}>
            <Text
              style={styles.subTextStyles}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}
            >
              {tipText}
              {isLongCurrencySymbol ? (
                <Text
                  style={{ color: theme.colors.card_typography }}
                >{` · ${currencySymbol}`}</Text>
              ) : null}
            </Text>
            <View style={styles.horizontalTextContainer}>
              <Text
                style={styles.subDigitStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {!isLongCurrencySymbol ? <Text>{currencySymbol}</Text> : null}
                {totalTipAmount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create(({ colors, fonts }, runtime) => ({
  superMainContainer: {
    marginTop: (runtime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (runtime.screen.height * 2) / 100,
    borderRadius: (runtime.screen.height * 1) / 100,
  },
  titleRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeftContainer: {
    flex: 1,
  },
  titleRightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingEnd: (runtime.screen.width * 5) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (runtime.screen.width * 5) / 100,
  },
  currencySymbol: {
    color: colors.card_typography,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (runtime.screen.height * 0.5) / 100,
    marginHorizontal: (runtime.screen.width * 5) / 100,
  },
  mainInnerContainer: {
    flexDirection: 'row',
    width: '100%',
    minHeight: (runtime.screen.height * 10.5) / 100,
  },
  totalAmountsContainer: {
    flex: 1,
    paddingVertical: (runtime.screen.height * 2) / 100,
    paddingHorizontal: (runtime.screen.width * 5) / 100,
  },
  totalDigitsStyles: {
    fontSize: 40,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  subTextStyles: {
    fontSize: 12,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  subDigitStyles: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  subTotalAndTipAmountsContainer: {
    flex: 1,
    paddingHorizontal: (runtime.screen.width * 5) / 100,
    paddingVertical: (runtime.screen.height * 0.5) / 100,
  },
  subTotalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  tipContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  verticalDeviderStyles: {
    backgroundColor: colors.devider,
    height: '100%',
    width: StyleSheet.hairlineWidth * 8,
    borderRadius: StyleSheet.hairlineWidth * 8,
  },
  horizontalTextContainer: {
    flexDirection: 'row',
  },
}));
