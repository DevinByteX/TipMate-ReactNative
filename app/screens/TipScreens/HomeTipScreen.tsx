import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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

  // Check if current tip already exists in saved tips within the time window
  const existingSavedTip = useMemo(() => {
    // Early returns for edge cases
    if (!shareData || !state.savedTips || state.duplicatePreventionWindow === 0) {
      return null;
    }

    const currentTime = Date.now();
    const windowMs = state.duplicatePreventionWindow * 60 * 1000;

    // Helper function to compare floating point numbers with epsilon tolerance
    const areFloatsEqual = (a: number, b: number, epsilon: number = 0.001): boolean => {
      return Math.abs(a - b) < epsilon;
    };

    return state.savedTips.find(
      savedTip =>
        currentTime - savedTip.timestamp < windowMs &&
        areFloatsEqual(savedTip.amount, shareData.amount) &&
        areFloatsEqual(savedTip.tip, shareData.tip) &&
        areFloatsEqual(savedTip.total, shareData.total) &&
        savedTip.tipPercentage === shareData.tipPercentage &&
        savedTip.numberOfPeople === shareData.numberOfPeople &&
        savedTip.currencyCode === shareData.currencyCode,
    );
  }, [shareData, state.savedTips, state.duplicatePreventionWindow]);

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
        headerTitle={t('screens.home.title')}
        headerSubTitle={t('screens.home.tagline')}
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
          titleText={t('screens.home.billAmount')}
          description={t('components.billInput.description')}
          currencySymbol={currencySymbol}
          returnKeyType={'done'}
          keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'number-pad'}
          onAmountChange={amount => setUserInputBillAmount(amount)}
        />
        {/* Tip Percentage Options Container */}
        <StyledTipOptions
          titleText={t('screens.home.selectTip')}
          description={t('components.tipInput.description')}
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
          titleText={t('screens.home.totalCost')}
          description={t('components.billBox.totalDescription')}
          currencySymbol={currencySymbol}
          totalText={t('components.billBox.total')}
          subTotalText={t('components.billBox.subtotal')}
          tipText={t('components.billBox.tip')}
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
          titleText={t('screens.home.roundTotal')}
          description={t('components.roundOptions.description')}
          roundMethod={userInputRound}
          disablingRoundingMethod={billValues?.disabledRoundingMethods}
          onSelectedRound={roundValue => {
            setUserInputRound(roundValue);
          }}
        />
        {/* Split Options Container */}
        <StyledSpiltOptions
          titleText={t('screens.home.splitCount')}
          description={t('components.splitOptions.description')}
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
            titleText={t('screens.home.perPerson')}
            description={t('components.billBox.perPersonDescription')}
            currencySymbol={currencySymbol}
            totalText={t('components.billBox.total')}
            subTotalText={t('components.billBox.subtotal')}
            tipText={t('components.billBox.tip')}
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
        title={t('common.success')}
        message={t('screens.home.tipSaved')}
        type="success"
        buttons={[
          {
            text: t('common.ok'),
            style: 'cancel',
            onPress: () => setSaveSuccessAlert({ visible: false }),
          },
          {
            text: t('common.viewDetails'),
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
        title={t('common.error')}
        message={t('screens.home.tipSaveFailed')}
        type="error"
        buttons={[
          { text: t('common.ok'), style: 'default', onPress: () => setSaveErrorAlert(false) },
        ]}
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
