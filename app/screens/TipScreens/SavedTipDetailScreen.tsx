import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  StyledHeader,
  StyledBillBox,
  StyledIcons,
  StyledSharePreviewModal,
  StyledAlert,
} from '@components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSaveTip } from '@hooks';
import { useShareTipPreview } from '@hooks';
import { useUserSettings } from '@/context/AppContext';
import { getLocaleForFormatting } from '@/localization';
import type { RootStackParamList } from '@navigation/types';

const SavedTipDetailScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  const { state: settingsState } = useUserSettings();
  const route = useRoute<RouteProp<RootStackParamList, 'SavedTipDetailScreen'>>();
  const navigation = useNavigation();
  const { deleteTip } = useSaveTip();
  const tip = route.params?.tip;

  // Prepare share data (null when tip is not available so hooks can be called unconditionally)
  const shareData = tip
    ? {
        amount: tip.amount,
        tip: tip.tip,
        total: tip.total,
        tipPercentage: tip.tipPercentage,
        numberOfPeople: tip.numberOfPeople,
        splitType: tip.splitType,
        perPerson: tip.perPerson,
        individualSplits: tip.individualSplits,
        taxAmount: tip.taxAmount,
        currencySymbol: tip.currencySymbol,
      }
    : null;

  // Hooks must be called before any early return to satisfy rules-of-hooks
  const {
    isPreviewVisible,
    previewContent,
    openPreview,
    closePreview,
    shareAsText,
    shareAsPDF,
    handleModalDismiss,
  } = useShareTipPreview(shareData);

  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  if (!tip) {
    navigation.goBack();
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(getLocaleForFormatting(settingsState.language), {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    setIsDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    deleteTip(tip.id);
    setIsDeleteAlertVisible(false);
    navigation.goBack();
  };

  return (
    <>
      <StyledHeader
        headerTitle={t('screens.savedTipDetail.title')}
        headerSubTitle={t('screens.savedTipDetail.subtitle')}
        headerRightIconVisibilty={true}
        headerRightIconType={'MaterialDesignIcons'}
        headerRightIconName={'delete'}
        headerRightIconColor={theme.colors.accent}
        onHeaderRightIconPress={handleDelete}
        enableBackButton={true}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Date and Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <StyledIcons
              type={'FontAwesome6'}
              name={'calendar-days'}
              size={20}
              color={theme.colors.accent}
            />
            <Text style={styles.dateText}>{formatDate(tip.timestamp)}</Text>
          </View>
          <View style={styles.infoRow}>
            <StyledIcons type={'Ionicons'} name={'people'} size={20} color={theme.colors.accent} />
            <Text style={styles.peopleText}>
              {tip.numberOfPeople}{' '}
              {tip.numberOfPeople === 1
                ? t('screens.savedTipDetail.person')
                : t('screens.savedTipDetail.people')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <StyledIcons
              type={'FontAwesome6'}
              name={'coins'}
              size={20}
              color={theme.colors.accent}
            />
            <Text style={styles.currencyText}>
              {tip.currencyCode} ({tip.currencySymbol})
            </Text>
          </View>
        </View>

        {/* Total Bill Container */}
        <StyledBillBox
          titleVisibility
          titleText={t('screens.savedTipDetail.totalCost')}
          description={t('components.billBox.savedTotalDescription')}
          currencySymbol={tip.currencySymbol}
          totalText={t('components.billBox.total')}
          subTotalText={t('components.billBox.subtotal')}
          tipText={t('components.billBox.tip')}
          totalAmount={tip.total.toFixed(2)}
          subTotalAmount={tip.amount.toFixed(2)}
          totalTipAmount={tip.tip.toFixed(2)}
          taxAmount={tip.taxAmount !== undefined ? tip.taxAmount.toFixed(2) : undefined}
          taxText={t('components.billBox.tax')}
          shareButtonPress={openPreview}
          hideSaveButton={true}
        />

        {/* Per Person Bill Container */}
        {tip.numberOfPeople > 1 && tip.perPerson && tip.splitType !== 'custom' ? (
          <StyledBillBox
            titleVisibility
            titleText={t('screens.savedTipDetail.perPerson')}
            description={t('components.billBox.savedPerPersonDescription')}
            currencySymbol={tip.currencySymbol}
            totalText={t('components.billBox.total')}
            subTotalText={t('components.billBox.subtotal')}
            tipText={t('components.billBox.tip')}
            taxText={t('components.billBox.tax')}
            totalAmount={tip.perPerson.total.toFixed(2)}
            subTotalAmount={tip.perPerson.amount.toFixed(2)}
            totalTipAmount={tip.perPerson.tip.toFixed(2)}
            taxAmount={tip.perPerson.tax !== undefined ? tip.perPerson.tax.toFixed(2) : undefined}
            shareButtonPress={openPreview}
            hideSaveButton={true}
          />
        ) : null}

        {/* Custom Split Breakdown */}
        {tip.splitType === 'custom' && tip.individualSplits && tip.individualSplits.length > 0 ? (
          <StyledBillBox
            titleVisibility
            titleText={t('screens.savedTipDetail.perPerson')}
            description={t('share.customSplitLabel')}
            currencySymbol={tip.currencySymbol}
            totalText={t('components.billBox.total')}
            subTotalText={t('components.billBox.subtotal')}
            tipText={t('components.billBox.tip')}
            totalAmount={tip.total.toFixed(2)}
            subTotalAmount={tip.amount.toFixed(2)}
            totalTipAmount={tip.tip.toFixed(2)}
            shareButtonPress={openPreview}
            hideSaveButton={true}
            individualSplits={tip.individualSplits}
          />
        ) : null}

        {/* Tip Percentage Info */}
        <View style={styles.tipPercentageCard}>
          <Text style={styles.tipPercentageLabel}>{t('screens.savedTipDetail.tipPercentage')}</Text>
          <Text style={styles.tipPercentageValue}>{tip.tipPercentage}%</Text>
        </View>
      </ScrollView>

      {/* Share Preview Modal */}
      {shareData && (
        <StyledSharePreviewModal
          isPreviewVisible={isPreviewVisible}
          onClose={closePreview}
          previewContent={previewContent}
          onShareText={shareAsText}
          onSharePDF={shareAsPDF}
          onDismiss={handleModalDismiss}
        />
      )}

      {/* Delete Confirmation Alert */}
      <StyledAlert
        visible={isDeleteAlertVisible}
        customIcon={{ iconType: 'MaterialDesignIcons', iconName: 'delete-outline' }}
        title={t('screens.savedTipDetail.deleteTip')}
        message={t('screens.savedTipDetail.confirmDelete')}
        type="confirm"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => setIsDeleteAlertVisible(false),
          },
          { text: t('common.delete'), style: 'destructive', onPress: confirmDelete },
        ]}
        onDismiss={() => setIsDeleteAlertVisible(false)}
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (UnistylesRuntime.screen.height * 8) / 100,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    padding: (UnistylesRuntime.screen.width * 4) / 100,
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
    gap: (UnistylesRuntime.screen.height * 1) / 100,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: (UnistylesRuntime.screen.width * 3) / 100,
  },
  dateText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
    flex: 1,
  },
  peopleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
    flex: 1,
  },
  currencyText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
    flex: 1,
  },
  tipPercentageCard: {
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    padding: (UnistylesRuntime.screen.width * 4) / 100,
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipPercentageLabel: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  tipPercentageValue: {
    fontSize: 20,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
}));

export default SavedTipDetailScreen;
