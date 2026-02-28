import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '@components';
import { useValuePulse, useBounce } from '@hooks';

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
  shareButtonPress?: () => void;
  saveButtonPress?: () => void;
  hideSaveButton?: boolean;
  isSaved?: boolean;
  savedTipId?: string;
  onBookmarkCheckPress?: () => void;
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
  saveButtonPress,
  hideSaveButton = false,
  isSaved = false,
  savedTipId,
  onBookmarkCheckPress,
}: StyledBillBox) => {
  const isLongCurrencySymbol: boolean =
    typeof currencySymbol === 'string' && currencySymbol.length > 1;

  const { styles, theme } = useStyles(stylesheet);
  const { animatedStyle: totalPulseStyle } = useValuePulse(totalAmount);
  const { trigger: triggerBookmarkBounce, animatedStyle: bookmarkBounceStyle } = useBounce();
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
          {!hideSaveButton && (
            <Animated.View style={bookmarkBounceStyle}>
              <StyledIcons
                type={'MaterialDesignIcons'}
                name={isSaved ? 'bookmark-check' : 'bookmark-outline'}
                size={styles.titleText?.fontSize + 7}
                color={
                  Number(totalAmount) > 0 ? styles.titleText?.color : theme.colors.disable_button
                }
                disabled={Number(totalAmount) <= 0}
                onPress={() => {
                  if (isSaved && savedTipId && onBookmarkCheckPress) {
                    onBookmarkCheckPress();
                  } else if (!isSaved) {
                    triggerBookmarkBounce();
                    saveButtonPress && saveButtonPress();
                  }
                }}
              />
            </Animated.View>
          )}
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
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
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
            <Animated.Text
              style={[styles.totalDigitsStyles, totalPulseStyle]}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}
            >
              {!isLongCurrencySymbol ? <Text>{currencySymbol}</Text> : null}
              {totalAmount}
            </Animated.Text>
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

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  superMainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeftContainer: {
    flex: 2,
  },
  titleRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: (UnistylesRuntime.screen.width * 3) / 100,
    paddingEnd: (UnistylesRuntime.screen.width * 5) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  currencySymbol: {
    color: colors.card_typography,
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
