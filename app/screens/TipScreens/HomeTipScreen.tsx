import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// custom component
import { StyledHeader, StyledTextInput } from '@/components';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

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

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <StyledHeader />
      <View style={styles.mainContainer}>
        {/* Total Amount container */}
        <View style={styles.totalAmountContainer}>
          <Text style={styles.totalAmountTitleText}>TOTAL AMOUNT</Text>
          <StyledTextInput
            placeholderText={'Tap to Enter Your Bill Amount'}
            returnKeyType={'done'}
            keyboardType={'numeric'}
          />
        </View>
        {/* Per Person Bill Container */}
        <View style={styles.perPersonBillAmounts}>
          <Text style={styles.perPersonBillAmountsTitleText}>PER PERSON</Text>
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
                $973.69
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                Total
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
                  SUBTOTAL
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '800', color: 'white' }}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  $84.95
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
                  TIP
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '800', color: 'white' }}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  $12.74
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Total Bill Container */}
        <View style={styles.perPersonBillAmounts}>
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
                $973.69
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                Total
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
                  SUBTOTAL
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '800', color: 'white' }}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  $84.95
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
                  TIP
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '800', color: 'white' }}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  $12.74
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  totalAmountContainer: {
    width: '100%',
    backgroundColor: '#444444',
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  totalAmountTitleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
  },
  perPersonBillAmounts: {
    marginVertical: (UnistylesRuntime.screen.height * 2) / 100,
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

export default HomeTipScreen;
