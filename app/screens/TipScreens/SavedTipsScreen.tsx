import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, FlatList, Pressable, Alert } from 'react-native';
// Custom Component
import { StyledHeader, StyledIcons } from '@components';
// Styling
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useAppContext } from '@/context/AppContext';
import { SavedTip } from '@/context/types';
import { useSaveTip } from '@hooks';
import { useNavigation } from '@react-navigation/native';

const SavedTipsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { state } = useAppContext();
  const { deleteTip, clearAllTips } = useSaveTip();
  const navigation = useNavigation();

  const savedTips = useMemo(() => state.savedTips || [], [state.savedTips]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteTip = (tipId: string) => {
    Alert.alert('Delete Tip', 'Are you sure you want to delete this saved tip?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTip(tipId),
      },
    ]);
  };

  const handleTipPress = (tip: SavedTip) => {
    (navigation as any).navigate('SavedTipDetailScreen', { tip });
  };

  const renderTipCard = ({ item }: { item: SavedTip }) => (
    <Pressable
      style={styles.tipCard}
      onPress={() => handleTipPress(item)}
      onLongPress={() => handleDeleteTip(item.id)}
    >
      <View style={styles.cardLeft}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formatDate(item.timestamp)}</Text>
          <View style={styles.peopleTag}>
            <StyledIcons type={'Ionicons'} name={'people'} size={12} color={theme.colors.accent} />
            <Text style={styles.peopleText}>{item.numberOfPeople}</Text>
          </View>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Bill:</Text>
          <Text style={styles.amountValue}>
            {item.currencySymbol}
            {item.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Tip ({item.tipPercentage}%):</Text>
          <Text style={styles.tipValue}>
            {item.currencySymbol}
            {item.tip.toFixed(2)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.amountRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>
            {item.currencySymbol}
            {item.total.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <StyledIcons
          type={'MaterialDesignIcons'}
          name={'chevron-right'}
          size={24}
          color={theme.colors.card_typography}
        />
      </View>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <StyledIcons
        type={'MaterialDesignIcons'}
        name={'bookmark-outline'}
        size={80}
        color={theme.colors.disable_button}
      />
      <Text style={styles.emptyTitle}>No Saved Tips</Text>
      <Text style={styles.emptyDescription}>
        Tips you save from the calculator will appear here.
      </Text>
      <Text style={styles.emptyHint}>Look for the bookmark icon on your calculated tips!</Text>
    </View>
  );

  return (
    <>
      <StyledHeader
        headerTitle={'Saved Tips'}
        headerSubTitle={'History & Summary'}
        headerRightIconVisibilty={false}
      />
      <View style={styles.mainContainer}>
        {savedTips.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.countText}>
              {savedTips.length} {savedTips.length === 1 ? 'Tip' : 'Tips'} Saved
            </Text>
            <Pressable onPress={clearAllTips}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </Pressable>
          </View>
        )}
        <FlatList
          data={savedTips}
          renderItem={renderTipCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  countText: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card_typography,
  },
  clearAllText: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  listContainer: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 8) / 100,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    padding: (UnistylesRuntime.screen.width * 4) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLeft: {
    flex: 8,
  },
  cardRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
  },
  peopleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 0.3) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 0.5) / 100,
    gap: 4,
  },
  peopleText: {
    fontSize: 12,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
  },
  amountValue: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
  tipValue: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.devider,
    marginVertical: (UnistylesRuntime.screen.height * 0.8) / 100,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    color: colors.accent,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 10) / 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.Nunito_Black,
    color: colors.card_typography,
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
    textAlign: 'center',
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 10) / 100,
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.accent,
    textAlign: 'center',
    marginTop: (UnistylesRuntime.screen.height * 1.5) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 10) / 100,
  },
}));

export default SavedTipsScreen;
