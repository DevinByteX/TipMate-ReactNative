import React from 'react';
import { ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { StyledHeader, StyledBillBox, StyledIcons, StyledSharePreviewModal } from '@components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SavedTip } from '@/context/types';
import { useSaveTip } from '@hooks';
import { useShareTipPreview } from '@hooks';

type SavedTipDetailRouteParams = {
  SavedTipDetailScreen: {
    tip: SavedTip;
  };
};

const SavedTipDetailScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const route = useRoute<RouteProp<SavedTipDetailRouteParams, 'SavedTipDetailScreen'>>();
  const navigation = useNavigation();
  const { deleteTip } = useSaveTip();
  const tip = route.params?.tip;

  if (!tip) {
    navigation.goBack();
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Prepare share data
  const shareData = {
    amount: tip.amount,
    tip: tip.tip,
    total: tip.total,
    tipPercentage: tip.tipPercentage,
    numberOfPeople: tip.numberOfPeople,
    perPerson: tip.perPerson,
    currencySymbol: tip.currencySymbol,
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

  const handleDelete = () => {
    Alert.alert(
      'Delete Tip',
      'Are you sure you want to delete this saved tip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTip(tip.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <>
      <StyledHeader
        headerTitle={'Tip Details'}
        headerSubTitle={'Saved Calculation'}
        headerRightIconVisibilty={true}
        headerRightIconType={'MaterialDesignIcons'}
        headerRightIconName={'delete'}
        headerRightIconColor={theme.colors.error_toast}
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
              {tip.numberOfPeople} {tip.numberOfPeople === 1 ? 'Person' : 'People'}
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
          titleText={'TOTAL COST'}
          description={'Here is the complete breakdown of your saved tip calculation.'}
          currencySymbol={tip.currencySymbol}
          subTotalText={'SUB COST'}
          tipText={'TIP'}
          totalAmount={tip.total.toFixed(2)}
          subTotalAmount={tip.amount.toFixed(2)}
          totalTipAmount={tip.tip.toFixed(2)}
          shareButtonPress={openPreview}
          hideSaveButton={true}
        />

        {/* Per Person Bill Container */}
        {tip.numberOfPeople > 1 && tip.perPerson ? (
          <StyledBillBox
            titleVisibility
            titleText={'PER PERSON'}
            description={'Here is how the bill was split among everyone.'}
            currencySymbol={tip.currencySymbol}
            subTotalText={'SUB TOTAL'}
            totalAmount={tip.perPerson.total.toFixed(2)}
            subTotalAmount={tip.perPerson.amount.toFixed(2)}
            totalTipAmount={tip.perPerson.tip.toFixed(2)}
            shareButtonPress={openPreview}
            hideSaveButton={true}
          />
        ) : null}

        {/* Tip Percentage Info */}
        <View style={styles.tipPercentageCard}>
          <Text style={styles.tipPercentageLabel}>Tip Percentage</Text>
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
