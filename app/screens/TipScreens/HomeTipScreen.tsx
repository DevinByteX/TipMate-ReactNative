import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  RoundingMethod,
  RoundingMethodType,
  calculateBillValues,
  calculateBillValuesCustomSplit,
} from '@/utils/billCalculation';
import { useShareTipPreview, useSaveTip, getDeviceCurrency } from '@hooks';
import { useUserSettings, useHistory, useSplitSession } from '@/context/AppContext';
import { ActionTypes } from '@/context/actionTypes';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPositionRef = useRef<number>(0);

  const [userInputBillAmount, setUserInputBillAmount] = useState<number>(0);
  const [userInputTipPercentage, setUserInputTipPercentage] = useState<number>(5);
  const [userInputSplitCount, setUserInputSplitCount] = useState<number>(1);
  const [userInputRound, setUserInputRound] = useState<RoundingMethodType>(RoundingMethod.NO);

  const { state: settingsState } = useUserSettings();
  const { state: historyState } = useHistory();
  const { state: sessionState, dispatch } = useSplitSession();
  const {
    saveTip,
    saveSuccessAlert,
    setSaveSuccessAlert,
    saveErrorAlert,
    setSaveErrorAlert,
    navigateToTipDetail,
  } = useSaveTip();

  // Use persisted currency if user has explicitly selected one, otherwise use device currency
  const currentCurrency = settingsState?.currencyConfig || getDeviceCurrency();
  const currencySymbol: string = currentCurrency.currencySign;
  const currencyCode: string = currentCurrency.currencyId;

  const isCustomSplitActive = sessionState.activeSplitConfig?.type === 'custom';
  const customSplits = sessionState.activeSplitConfig?.customSplits;

  const { billValues, customBillValues } = useMemo(() => {
    if (isCustomSplitActive && customSplits && customSplits.length > 0) {
      return {
        customBillValues: calculateBillValuesCustomSplit(
          userInputTipPercentage,
          userInputBillAmount,
          userInputRound,
          customSplits,
        ),
        billValues: calculateBillValues(
          userInputTipPercentage,
          userInputBillAmount,
          customSplits.length,
          userInputRound,
        ),
      };
    }
    return {
      billValues: calculateBillValues(
        userInputTipPercentage,
        userInputBillAmount,
        userInputSplitCount,
        userInputRound,
      ),
      customBillValues: undefined,
    };
  }, [
    userInputTipPercentage,
    userInputBillAmount,
    userInputSplitCount,
    userInputRound,
    isCustomSplitActive,
    customSplits,
  ]);

  // Restore scroll position when returning from navigation
  useFocusEffect(
    React.useCallback(() => {
      // Small delay to ensure layout is complete before scrolling
      const timer = setTimeout(() => {
        if (scrollViewRef.current && scrollPositionRef.current > 0) {
          scrollViewRef.current.scrollTo({
            y: scrollPositionRef.current,
            animated: false,
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }, []),
  );

  // Store scroll position before navigating away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      // Position will be stored in onScroll event
    });

    return unsubscribe;
  }, [navigation]);

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
    if (!shareData || !historyState.savedTips || settingsState.duplicatePreventionWindow === 0) {
      return null;
    }

    const currentTime = Date.now();
    const windowMs = settingsState.duplicatePreventionWindow * 60 * 1000;

    // Helper function to compare floating point numbers with epsilon tolerance
    const areFloatsEqual = (a: number, b: number, epsilon: number = 0.001): boolean => {
      return Math.abs(a - b) < epsilon;
    };

    return historyState.savedTips.find(
      savedTip =>
        currentTime - savedTip.timestamp < windowMs &&
        areFloatsEqual(savedTip.amount, shareData.amount) &&
        areFloatsEqual(savedTip.tip, shareData.tip) &&
        areFloatsEqual(savedTip.total, shareData.total) &&
        savedTip.tipPercentage === shareData.tipPercentage &&
        savedTip.numberOfPeople === shareData.numberOfPeople &&
        savedTip.currencyCode === shareData.currencyCode &&
        (savedTip.splitType || 'equal') === shareData.splitType &&
        (savedTip.splitType === 'custom' && shareData.splitType === 'custom'
          ? shareData.splitSignature ===
            `custom:${JSON.stringify(
              (savedTip.individualSplits || []).map(s => ({
                id: s.id,
                allocationType: s.allocationType,
                value: s.value,
              })),
            )}`
          : true),
    );
  }, [shareData, historyState.savedTips, settingsState.duplicatePreventionWindow]);

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
        ref={scrollViewRef}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'on-drag'}
        scrollEventThrottle={16}
        onScroll={event => {
          scrollPositionRef.current = event.nativeEvent.contentOffset.y;
        }}
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
            dispatch({ type: ActionTypes.CLEAR_ACTIVE_SPLIT_CONFIG });
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
