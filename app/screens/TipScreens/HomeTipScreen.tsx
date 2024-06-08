import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTotalAmountInput,
  StyledTipOptions,
  StyledSpiltOptions,
  StyledRoundBox,
} from '@/components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  BillCalculationType,
  RoundingMethod,
  RoundingMethodType,
  calculateBillValues,
} from '@hooks';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);

  const [userInputBillAmount, setUserInputBillAmount] = useState<number>(0);
  const [userInputTipPercentage, setUserInputTipPercentage] = useState<number>(5);
  const [userInputSplitCount, setUserInputSplitCount] = useState<number>(1);
  const [userInputRound, setUserInputRound] = useState<RoundingMethodType>(RoundingMethod.NO);

  const [billValues, setBillValues] = useState<BillCalculationType>();

  useEffect(() => {
    const billValuesResults = calculateBillValues(
      userInputTipPercentage,
      userInputBillAmount,
      userInputSplitCount,
      userInputRound,
    );
    setBillValues(billValuesResults);

    return () => {};
  }, [userInputTipPercentage, userInputBillAmount, userInputSplitCount, userInputRound]);

  return (
    <>
      <StyledHeader headerTitle={'TipMate'} headerSubTitle={'Smart Tips, Easy Living'} />
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
          titleText="SELECT TIP"
          onSelectedTipValue={percentage => {
            setUserInputTipPercentage(percentage);
          }}
        />
        {/* Slip Options Container */}
        <StyledSpiltOptions
          titleText="SPLIT COUNT"
          onSelectedSplitValue={splitCount => {
            setUserInputSplitCount(splitCount);
          }}
        />
        {/* Round Options Container */}
        <StyledRoundBox
          titleText="ROUND VALUE"
          onSelectedRound={roundValue => {
            setUserInputRound(roundValue);
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
