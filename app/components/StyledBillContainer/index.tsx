import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

// Vertical Devider Component
const VerticalDevider = () => {
  return (
    <View
      style={{
        backgroundColor: '#4b4b4b',
        height: '100%',
        width: StyleSheet.hairlineWidth * 8,
      }}
    />
  );
};

type StyledBillContainer = {
  titleVisibility?: boolean;
  titleText?: string;
  currencySymbol?: string;
  totalText?: string;
  subTotalText?: string;
  tipText?: string;
  totalAmount?: string | number;
  subTotalAmount?: string | number;
  totalTipAmount?: string | number;
};

export const StyledBillContainer = ({
  titleVisibility = false,
  titleText = 'PER PERSON',
  currencySymbol = '$',
  totalText = 'TOTAL',
  subTotalText = 'SUBTOTAL',
  tipText = 'TIP',
  totalAmount = '00.00',
  subTotalAmount = '00.00',
  totalTipAmount = '00.00',
}: StyledBillContainer) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.perPersonBillAmounts}>
      {titleVisibility ? (
        <Text style={styles.perPersonBillAmountsTitleText}>{titleText}</Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
            paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
          }}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: '800',
              color: 'white',
            }}
            adjustsFontSizeToFit={true}
            allowFontScaling={false}
            numberOfLines={1}>
            {currencySymbol}{totalAmount}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
            {totalText}
          </Text>
        </View>
        <VerticalDevider />
        <View
          style={{
            flex: 1,
            paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
            paddingVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              marginHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
            }}>
            <Text
              style={{ fontSize: 12, fontWeight: '600', color: 'white' }}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}>
              {subTotalText}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: '800', color: 'white' }}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}>
              {currencySymbol}{subTotalAmount}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
            }}>
            <Text
              style={{ fontSize: 12, fontWeight: '600', color: 'white' }}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}>
              {tipText}
            </Text>
            <Text
              style={{ fontSize: 14, fontWeight: '800', color: 'white' }}
              adjustsFontSizeToFit={true}
              allowFontScaling={false}
              numberOfLines={1}>
              {currencySymbol}{totalTipAmount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  perPersonBillAmounts: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: '#444444',
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  perPersonBillAmountsTitleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
    paddingStart: (UnistylesRuntime.screen.width * 3) / 100,
  },
}));
