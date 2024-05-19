import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTotalAmountInput,
  StyledTipOptions,
  StyledSpiltOptions,
} from '@/components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { BillCalculationType, calculateBillValues } from '@hooks';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);

  const [userInputBillAmount, setUserInputBillAmount] = useState<number>(0);
  const [userInputTipPercentage, setUserInputTipPercentage] = useState<number>(0);
  const [userInputSplitCount, setUserInputSplitCount] = useState<number>(1);

  const [billValues, setBillValues] = useState<BillCalculationType>();

  useEffect(() => {
    const billValuesResults = calculateBillValues(
      userInputTipPercentage,
      userInputBillAmount,
      userInputSplitCount,
    );
    setBillValues(billValuesResults);

    return () => {};
  }, [userInputTipPercentage, userInputBillAmount, userInputSplitCount]);

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
          titleText="BILL AMOUNT"
          returnKeyType={'done'}
          keyboardType={'number-pad'}
          onAmountChange={amount => setUserInputBillAmount(amount)}
        />
        {/* Tip Percentage Options Container */}
        <StyledTipOptions
          onSelectedTipValue={percentage => {
            console.log(percentage);
            setUserInputTipPercentage(percentage);
          }}
        />
        {/* Slip Options Container */}
        <StyledSpiltOptions
          onSelectedSplitValue={splitCount => {
            setUserInputSplitCount(splitCount);
          }}
        />
        {/* Per Person Bill Container */}
        {userInputSplitCount > 1 ? (
          <StyledBillBox
            titleVisibility
            titleText="PER PERSON"
            totalAmount={billValues?.perPerson?.total?.toFixed(2)}
            subTotalAmount={billValues?.perPerson?.subtotal?.toFixed(2)}
            totalTipAmount={billValues?.perPerson?.tip?.toFixed(2)}
          />
        ) : null}
        {/* Total Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText="TOTAL BILL"
          totalAmount={billValues?.overall?.total?.toFixed(2)}
          subTotalAmount={billValues?.overall?.subtotal?.toFixed(2)}
          totalTipAmount={billValues?.overall?.tip?.toFixed(2)}
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
