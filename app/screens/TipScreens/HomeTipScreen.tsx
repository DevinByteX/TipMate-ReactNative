import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTotalAmountInput,
  StyledTipOptions,
} from '@/components';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

const HomeTipScreen = () => {
  const [totalAmount, setTotalAmount] = useState<string>();

  const { styles } = useStyles(stylesheet);

  return (
    <>
      <StyledHeader />
      <View style={styles.mainContainer}>
        {/* Total Amount container */}
        <StyledTotalAmountInput
          amountValue={totalAmount}
          returnKeyType={'done'}
          keyboardType={'number-pad'}
          onChangeText={text => {
            setTotalAmount(text);
          }}
        />
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
