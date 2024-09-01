import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';

// Vertical Devider Component
export const VerticalDevider = ({
  verticalDeviderAdditionalStyles,
}: {
  verticalDeviderAdditionalStyles?: ViewStyle;
}) => {
  const { styles } = useStyles(stylesheet);
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
}: StyledBillBox) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.superMainContainer}>
      {/* Title Text */}
      {titleVisibility ? <Text style={styles.titleText}>{`${titleText} `}</Text> : null}
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
          <Text style={styles.subTextStyles}>{totalText}</Text>
          <View style={styles.horizontalTextContainer}>
            {currencySymbol ? (
              <Text
                style={styles.totalDigitsStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}>
                {currencySymbol}
              </Text>
            ) : null}
            <Text
              style={styles.totalDigitsStyles}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}>
              {`${totalAmount}`}
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
              numberOfLines={1}>
              {`${subTotalText}`}
            </Text>
            <View style={styles.horizontalTextContainer}>
              {currencySymbol ? (
                <Text
                  style={styles.subDigitStyles}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  {currencySymbol}
                </Text>
              ) : null}
              <Text
                style={styles.subDigitStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}>
                {`${subTotalAmount}`}
              </Text>
            </View>
          </View>
          {/* Tip Text Container */}
          <View style={styles.tipContainer}>
            <Text
              style={styles.subTextStyles}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}>
              {tipText}
            </Text>
            <View style={styles.horizontalTextContainer}>
              {currencySymbol ? (
                <Text
                  style={styles.subDigitStyles}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  {currencySymbol}
                </Text>
              ) : null}
              <Text
                style={styles.subDigitStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}>
                {`${totalTipAmount}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  superMainContainer: {
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
    width: '100%',
    minHeight: (UnistylesRuntime.screen.height * 10.5) / 100,
  },
  totalAmountsContainer: {
    flex: 1,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
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
    width: UnistylesRuntime.hairlineWidth * 8,
    borderRadius: UnistylesRuntime.hairlineWidth * 8,
  },
  horizontalTextContainer: {
    flexDirection: 'row',
  },
}));
