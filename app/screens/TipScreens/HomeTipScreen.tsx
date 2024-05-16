import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTotalAmountInput,
  StyledTipOptions,
  StyledSpiltOptions,
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
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* Total Amount container */}
        <StyledTotalAmountInput
          amountValue={totalAmount}
          returnKeyType={'done'}
          keyboardType={'number-pad'}
          onChangeText={text => {
            setTotalAmount(text);
          }}
        />
        {/* Tip Percentage Options Container */}
        <StyledTipOptions onSelectedTipValue={text => {}} />
        {/* Slip Options Container */}
        <StyledSpiltOptions />
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
      </ScrollView>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (UnistylesRuntime.screen.height * 8) / 100,
  },
}));

export default HomeTipScreen;
