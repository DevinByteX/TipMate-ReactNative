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
import { StyleSheet } from 'react-native-unistyles';
import {
  BillCalculationType,
  RoundingMethod,
  RoundingMethodType,
  calculateBillValues,
} from '@hooks';
import { useAppContext } from '@/context/AppContext';
import { shareTipDetails } from '@/hooks/shareTipOption';

const HomeTipScreen = () => {
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

  const handleShareTipDetails = () => {
    if (!billValues) return;

    shareTipDetails({
      amount: userInputBillAmount,
      tip: parseFloat(billValues.overall.tip),
      total: parseFloat(billValues.overall.total),
      tipPercentage: userInputTipPercentage,
      numberOfPeople: userInputSplitCount,
      perPerson:
        userInputSplitCount > 1
          ? {
              amount: parseFloat(billValues.perPerson?.subtotal || '0'),
              tip: parseFloat(billValues.perPerson?.tip || '0'),
              total: parseFloat(billValues.perPerson?.total || '0'),
            }
          : undefined,
      currencySymbol,
    });
  };

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
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'on-drag'}
      >
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
          shareButtonPress={handleShareTipDetails}
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
        {userInputSplitCount > 1 ? (
          <StyledBillBox
            titleVisibility
            titleText={'PER PERSON'}
            description={'Curious about the split? Here’s the amount each person will chip in.'}
            currencySymbol={currencySymbol}
            subTotalText={'SUB TOTAL'}
            totalAmount={billValues?.perPerson?.total}
            subTotalAmount={billValues?.perPerson?.subtotal}
            totalTipAmount={billValues?.perPerson?.tip}
            shareButtonPress={handleShareTipDetails}
          />
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create(({ colors }, runtime) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (runtime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (runtime.screen.height * 8) / 100,
  },
}));

export default HomeTipScreen;
