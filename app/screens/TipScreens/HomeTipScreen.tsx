import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Platform } from 'react-native';
// custom component
import {
  StyledBillBox,
  StyledHeader,
  StyledTotalAmountInput,
  StyledTipOptions,
  StyledSpiltOptions,
  StyledRoundBox,
  StyledSharePreviewModal,
  StyledAlert,
} from '@/components';
// Styling
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  BillCalculationType,
  RoundingMethod,
  RoundingMethodType,
  calculateBillValues,
  useShareTipPreview,
  useSaveTip,
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
  const {
    saveTip,
    saveSuccessAlert,
    setSaveSuccessAlert,
    saveErrorAlert,
    setSaveErrorAlert,
    navigateToTipDetail,
  } = useSaveTip();

  const currencySymbol: string = state?.currencyConfig?.currencySign;
  const currencyCode: string = state?.currencyConfig?.currencyId;

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

  // Prepare share data
  const shareData = billValues
    ? {
        amount: userInputBillAmount,
        tip: parseFloat(billValues.overall.tip || '0'),
        total: parseFloat(billValues.overall.total || '0'),
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
        currencyCode,
      }
    : null;

  // Check if current tip already exists in saved tips
  const existingSavedTip = useMemo(() => {
    if (!shareData || !state.savedTips) {
      return null;
    }

    return state.savedTips.find(
      savedTip =>
        savedTip.amount === shareData.amount &&
        savedTip.tip === shareData.tip &&
        savedTip.total === shareData.total &&
        savedTip.tipPercentage === shareData.tipPercentage &&
        savedTip.numberOfPeople === shareData.numberOfPeople &&
        savedTip.currencyCode === shareData.currencyCode,
    );
  }, [shareData, state.savedTips]);

  const isTipAlreadySaved = !!existingSavedTip;

  // Handle save tip
  const handleSaveTip = () => {
    if (shareData && !isTipAlreadySaved) {
      saveTip(shareData);
    }
  };

  // Handle bookmark check press - navigate to saved tip detail
  const handleBookmarkCheckPress = () => {
    if (existingSavedTip) {
      navigateToTipDetail(existingSavedTip);
    }
  };

  // Use the share preview hook
  const {
    isPreviewVisible,
    previewContent,
    openPreview,
    closePreview,
    shareAsText,
    shareAsPDF,
    handleModalDismiss,
  } = useShareTipPreview(shareData);

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
          description={`Voilà! Here's your final amount, with the tip and any rounding all taken care of.`}
          currencySymbol={currencySymbol}
          subTotalText={'SUB COST'}
          tipText={'TIP'}
          totalAmount={billValues?.overall?.total}
          subTotalAmount={billValues?.overall?.subtotal}
          totalTipAmount={billValues?.overall?.tip}
          shareButtonPress={openPreview}
          saveButtonPress={handleSaveTip}
          isSaved={isTipAlreadySaved}
          savedTipId={existingSavedTip?.id}
          onBookmarkCheckPress={handleBookmarkCheckPress}
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
            description={`Curious about the split? Here's the amount each person will chip in.`}
            currencySymbol={currencySymbol}
            subTotalText={'SUB TOTAL'}
            totalAmount={billValues?.perPerson?.total}
            subTotalAmount={billValues?.perPerson?.subtotal}
            totalTipAmount={billValues?.perPerson?.tip}
            shareButtonPress={openPreview}
            saveButtonPress={handleSaveTip}
            isSaved={isTipAlreadySaved}
            savedTipId={existingSavedTip?.id}
            onBookmarkCheckPress={handleBookmarkCheckPress}
          />
        ) : null}
      </ScrollView>

      {/* Share Preview Modal */}
      <StyledSharePreviewModal
        isPreviewVisible={isPreviewVisible}
        onClose={closePreview}
        onShareText={shareAsText}
        onSharePDF={shareAsPDF}
        previewContent={previewContent}
        onDismiss={handleModalDismiss}
      />

      {/* Save Success Alert */}
      <StyledAlert
        visible={saveSuccessAlert.visible}
        title="Success"
        message="Tip calculation saved successfully!"
        type="success"
        buttons={[
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => setSaveSuccessAlert({ visible: false }),
          },
          {
            text: 'View Details',
            style: 'default',
            onPress: () =>
              saveSuccessAlert.savedTip && navigateToTipDetail(saveSuccessAlert.savedTip),
          },
        ]}
        onDismiss={() => setSaveSuccessAlert({ visible: false })}
      />

      {/* Save Error Alert */}
      <StyledAlert
        visible={saveErrorAlert}
        title="Error"
        message="Failed to save tip calculation. Please try again."
        type="error"
        buttons={[{ text: 'OK', style: 'default', onPress: () => setSaveErrorAlert(false) }]}
        onDismiss={() => setSaveErrorAlert(false)}
      />
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
