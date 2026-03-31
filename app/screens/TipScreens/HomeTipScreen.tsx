import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
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
  CustomSplitCalculationType,
  RoundingMethod,
  RoundingMethodType,
  calculateBillValues,
  calculateBillValuesCustomSplit,
  useShareTipPreview,
  useSaveTip,
  getDeviceCurrency,
} from '@hooks';
import { useAppContext } from '@/context/AppContext';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [userInputBillAmount, setUserInputBillAmount] = useState<number>(0);
  const [userInputTipPercentage, setUserInputTipPercentage] = useState<number>(5);
  const [userInputSplitCount, setUserInputSplitCount] = useState<number>(1);
  const [userInputRound, setUserInputRound] = useState<RoundingMethodType>(RoundingMethod.NO);

  const [billValues, setBillValues] = useState<BillCalculationType>();
  const [customBillValues, setCustomBillValues] = useState<CustomSplitCalculationType>();
  const { state, dispatch } = useAppContext();
  const {
    saveTip,
    saveSuccessAlert,
    setSaveSuccessAlert,
    saveErrorAlert,
    setSaveErrorAlert,
    navigateToTipDetail,
  } = useSaveTip();

  // Use persisted currency if user has explicitly selected one, otherwise use device currency
  const currentCurrency = state?.currencyConfig || getDeviceCurrency();
  const currencySymbol: string = currentCurrency.currencySign;
  const currencyCode: string = currentCurrency.currencyId;

  const isCustomSplitActive = state.activeSplitConfig?.type === 'custom';
  const customSplits = state.activeSplitConfig?.customSplits;

  useEffect(() => {
    if (isCustomSplitActive && customSplits && customSplits.length > 0) {
      // Use custom split calculation
      const customResults = calculateBillValuesCustomSplit(
        userInputTipPercentage,
        userInputBillAmount,
        userInputRound,
        customSplits,
      );
      setCustomBillValues(customResults);
      // Also calculate equal split for overall display
      const equalResults = calculateBillValues(
        userInputTipPercentage,
        userInputBillAmount,
        customSplits.length,
        userInputRound,
      );
      setBillValues(equalResults);
    } else {
      // Regular equal split calculation
      const billValuesResults = calculateBillValues(
        userInputTipPercentage,
        userInputBillAmount,
        userInputSplitCount,
        userInputRound,
      );
      setBillValues(billValuesResults);
      setCustomBillValues(undefined);
    }

    return () => {};
  }, [
    userInputTipPercentage,
    userInputBillAmount,
    userInputSplitCount,
    userInputRound,
    isCustomSplitActive,
    customSplits,
  ]);

  // Prepare share data
  const effectiveOverall =
    isCustomSplitActive && customBillValues ? customBillValues.overall : billValues?.overall;

  const shareData = effectiveOverall
    ? {
        amount: userInputBillAmount,
        tip: parseFloat(effectiveOverall.tip || '0'),
        total: parseFloat(effectiveOverall.total || '0'),
        tipPercentage: userInputTipPercentage,
        numberOfPeople:
          isCustomSplitActive && customSplits ? customSplits.length : userInputSplitCount,
        splitType: (isCustomSplitActive ? 'custom' : 'equal') as 'equal' | 'custom',
        // A stable, primitive representation of the split configuration for duplicate detection.
        // Uses input data (not calculated amounts) so rounding changes don't break detection.
        splitSignature:
          isCustomSplitActive && customSplits
            ? `custom:${JSON.stringify(
                customSplits.map(s => ({
                  id: s.id,
                  allocationType: s.allocationType,
                  value: s.value,
                })),
              )}`
            : 'equal',
        perPerson:
          !isCustomSplitActive && userInputSplitCount > 1 && billValues
            ? {
                amount: parseFloat(billValues.perPerson?.subtotal || '0'),
                tip: parseFloat(billValues.perPerson?.tip || '0'),
                total: parseFloat(billValues.perPerson?.total || '0'),
              }
            : undefined,
        individualSplits:
          isCustomSplitActive && customBillValues ? customBillValues.individuals : undefined,
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
          isCustomSplitActive={isCustomSplitActive}
          billAmount={userInputBillAmount}
          onCustomSplitPress={() => {
            navigation.navigate('CustomSplitScreen', {
              totalBill: userInputBillAmount,
              tipPercentage: userInputTipPercentage,
              currencySymbol,
            });
          }}
          onClearCustomSplit={() => {
            dispatch({ type: 'CLEAR_ACTIVE_SPLIT_CONFIG' });
            setUserInputSplitCount(1);
          }}
        />
        {/* Per Person Bill Container — Equal Split */}
        {!isCustomSplitActive && userInputSplitCount > 1 ? (
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
        {/* Per Person Bill Container — Custom Split */}
        {isCustomSplitActive && customBillValues ? (
          <StyledBillBox
            titleVisibility
            titleText={t('screens.home.totalCost')}
            description={t('components.billBox.perPersonDescription')}
            currencySymbol={currencySymbol}
            totalText={t('components.billBox.total')}
            subTotalText={t('components.billBox.subtotal')}
            tipText={t('components.billBox.tip')}
            totalAmount={customBillValues.overall.total}
            subTotalAmount={customBillValues.overall.subtotal}
            totalTipAmount={customBillValues.overall.tip}
            shareButtonPress={openPreview}
            saveButtonPress={handleSaveTip}
            isSaved={isTipAlreadySaved}
            savedTipId={existingSavedTip?.id}
            onBookmarkCheckPress={handleBookmarkCheckPress}
            individualSplits={customBillValues.individuals}
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
