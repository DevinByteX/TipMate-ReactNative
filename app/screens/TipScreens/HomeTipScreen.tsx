import React, { useEffect, useState } from 'react';
import { ScrollView, Platform } from 'react-native';
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
import { useAppContext } from '@/context/AppContext';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);

  const [userInputBillAmount, setUserInputBillAmount] = useState<number>(0);
  const [userInputTipPercentage, setUserInputTipPercentage] = useState<number>(5);
  const [userInputSplitCount, setUserInputSplitCount] = useState<number>(1);
  const [userInputRound, setUserInputRound] = useState<RoundingMethodType>(RoundingMethod.NO);

  const [billValues, setBillValues] = useState<BillCalculationType>();
  const { state } = useAppContext();

  const currencySymbol: string = state?.currencyConfig?.currencySign;

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
          currencySymbol={currencySymbol}
          returnKeyType={'done'}
          keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'number-pad'}
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
        {/* Total Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText={'TOTAL COST'}
          description={
            'Voilà! Here’s your final amount, with the tip and any rounding all taken care of.'
          }
          currencySymbol={currencySymbol}
          subTotalText={'SUB COST'}
          tipText={'TIP'}
          totalAmount={billValues?.overall?.total}
          subTotalAmount={billValues?.overall?.subtotal}
          totalTipAmount={billValues?.overall?.tip}
        />
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
        {/* Split Options Container */}
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
        {/* {userInputSplitCount > 1 ? ( */}
        <StyledBillBox
          titleVisibility
          titleText={'PER PERSON'}
          description={'Curious about the split? Here’s the amount each person will chip in.'}
          currencySymbol={currencySymbol}
          subTotalText={'SUB TOTAL'}
          totalAmount={billValues?.perPerson?.total}
          subTotalAmount={billValues?.perPerson?.subtotal}
          totalTipAmount={billValues?.perPerson?.tip}
        />
        {/* ) : null} */}
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
