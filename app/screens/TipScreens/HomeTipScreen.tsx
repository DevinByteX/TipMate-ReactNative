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
// Styling
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
      <StyledHeader
        headerTitle={'TipMate'}
        headerSubTitle={'Smart Tips, Easy Living'}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* Total Amount container */}
        <StyledTotalAmountInput
          titleText={'BILL AMOUNT'}
          description={'Pop in the total bill amount here – let’s get started!'}
          returnKeyType={'done'}
          keyboardType={'decimal-pad'}
          onAmountChange={amount => setUserInputBillAmount(amount)}
        />
        {/* Tip Percentage Options Container */}
        <StyledTipOptions
          titleText={'SELECT TIP'}
          description={'Feeling generous? Choose your tip percentage and watch the magic happen.'}
          onSelectedTipValue={percentage => {
            if (percentage === 0) {
              setUserInputRound(RoundingMethod.NO);
            }
            setUserInputTipPercentage(percentage);
          }}
        />
        {/* Slip Options Container */}
        <StyledSpiltOptions
          titleText={'SPLIT COUNT'}
          description={
            'Dining with friends? Let us know how many, and we’ll split the bill for you.'
          }
          onSelectedSplitValue={splitCount => {
            if (splitCount === 1) {
              setUserInputRound(RoundingMethod.NO);
            }
            setUserInputSplitCount(splitCount);
          }}
        />
        {/* Per Person Bill Container */}
        {userInputSplitCount > 1 ? (
          <StyledBillBox
            titleVisibility
            titleText={'PER PERSON'}
            description={'Curious about the split? Here’s the amount each person will chip in.'}
            subTotalText={'SUB TOTAL'}
            totalAmount={billValues?.perPerson?.total}
            subTotalAmount={billValues?.perPerson?.subtotal}
            totalTipAmount={billValues?.perPerson?.tip}
          />
        ) : null}
        {/* Round Options Container */}
        <StyledRoundBox
          titleText={'ROUND TOTAL'}
          description={'Prefer a neat number? Round up or down to make your total picture-perfect.'}
          roundMethod={userInputRound}
          disablingRoundingMethod={billValues?.disabledRoundingMethods}
          onSelectedRound={roundValue => {
            setUserInputRound(roundValue);
          }}
        />
        {/* Total Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText={'TOTAL COST'}
          description={
            'Voilà! Here’s your final amount, with the tip and any rounding all taken care of.'
          }
          subTotalText={'SUB COST'}
          tipText={'TIP'}
          totalAmount={billValues?.overall?.total}
          subTotalAmount={billValues?.overall?.subtotal}
          totalTipAmount={billValues?.overall?.tip}
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
