import React, { useState } from 'react';
import { Text, View, ViewStyle, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { StyledIcons } from '@components';
import { useValuePulse, useBounce } from '@hooks';
import { toFixedWithoutRounding } from '@utils';
import { IndividualSplit } from '@/context/types';

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
  taxText?: string;
  totalAmount?: string | number;
  subTotalAmount?: string | number;
  totalTipAmount?: string | number;
  taxAmount?: string;
  shareButtonPress?: () => void;
  saveButtonPress?: () => void;
  hideSaveButton?: boolean;
  isSaved?: boolean;
  savedTipId?: string;
  onBookmarkCheckPress?: () => void;
  individualSplits?: IndividualSplit[];
};

export const StyledBillBox = ({
  titleVisibility = false,
  titleText = 'PER PERSON',
  description,
  currencySymbol,
  totalText = 'TOTAL',
  subTotalText = 'SUBTOTAL',
  tipText = 'TIP',
  taxText = 'TAX',
  totalAmount = '0.00',
  subTotalAmount = '0.00',
  totalTipAmount = '0.00',
  taxAmount,
  shareButtonPress,
  saveButtonPress,
  hideSaveButton = false,
  isSaved = false,
  savedTipId,
  onBookmarkCheckPress,
  individualSplits,
}: StyledBillBox) => {
  const [isSplitsExpanded, setIsSplitsExpanded] = useState(false);
  const isLongCurrencySymbol: boolean =
    typeof currencySymbol === 'string' && currencySymbol.length > 1;

  const { t } = useTranslation();
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
          {taxAmount && parseFloat(taxAmount) > 0 ? (
            <View style={styles.tipContainer}>
              <Text
                style={styles.subTextStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {taxText}
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
                  {taxAmount}
                </Text>
              </View>
            </View>
          ) : null}
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
      {/* Individual Splits Accordion */}
      {individualSplits && individualSplits.length > 0 && (
        <View style={styles.individualSplitsContainer}>
          <Pressable
            style={styles.individualSplitsHeader}
            onPress={() => setIsSplitsExpanded(!isSplitsExpanded)}
          >
            <View style={styles.individualSplitsHeaderLeft}>
              <StyledIcons
                type="MaterialDesignIcons"
                name="account-multiple"
                size={14}
                color={styles.titleText?.color}
              />
              <Text style={styles.individualSplitsTitle}>
                {`${individualSplits.length} ${t('screens.savedTipDetail.people')}`}
              </Text>
            </View>
            <StyledIcons
              type="MaterialDesignIcons"
              name={isSplitsExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={styles.titleText?.color}
            />
          </Pressable>
          {isSplitsExpanded && (
            <View style={styles.individualSplitsList}>
              {individualSplits.map((split, index) => (
                <View key={split.id || index} style={styles.individualSplitRow}>
                  <View style={styles.individualSplitNameContainer}>
                    <Text style={styles.individualSplitName} numberOfLines={1}>
                      {split.name}
                    </Text>
                    <Text style={styles.individualSplitType}>
                      {split.allocationType === 'fixed'
                        ? `${currencySymbol}${toFixedWithoutRounding(split.value || 0, 2)}`
                        : split.allocationType === 'percentage'
                        ? `${split.value || 0}%`
                        : t('screens.customSplit.remainder')}
                    </Text>
                  </View>
                  <Text style={styles.individualSplitAmount}>
                    {!isLongCurrencySymbol ? currencySymbol : ''}
                    {toFixedWithoutRounding(split.calculatedAmount || 0, 2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography }) => ({
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  currencySymbol: {
    color: colors.card_typography,
  },
  instructionText: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
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
    fontSize: typography.fontSize.display,
    lineHeight: typography.lineHeight.display,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  subTextStyles: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  subDigitStyles: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
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
  // Individual Splits
  individualSplitsContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderTopWidth: UnistylesRuntime.hairlineWidth * 4,
    borderTopColor: colors.devider,
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  individualSplitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  individualSplitsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  individualSplitsTitle: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  individualSplitsList: {
    marginTop: (UnistylesRuntime.screen.height * 0.8) / 100,
    gap: (UnistylesRuntime.screen.height * 0.6) / 100,
  },
  individualSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: (UnistylesRuntime.screen.height * 0.4) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
    backgroundColor: colors.backgroundColor,
    borderRadius: 6,
  },
  individualSplitNameContainer: {
    flex: 1,
    marginRight: 8,
  },
  individualSplitName: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card_typography,
  },
  individualSplitType: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontFamily: fonts.Nunito_Medium,
    color: colors.accent,
  },
  individualSplitAmount: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
}));
