import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTextInput,
  StyledTipOptions,
} from '@/components';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

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
        {/* Tip Percentage Option Container */}
        <StyledTipOptions />
        {/* Per Person Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText="PER PERSON"
          totalAmount={100.34}
        />
        {/* Total Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText="TOTAL BILL"
          totalAmount={132.27}
        />
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  totalAmountTitleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
  },
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

export default HomeTipScreen;
