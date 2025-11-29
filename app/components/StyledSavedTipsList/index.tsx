import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { StyledIcons } from '@components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { SavedTip } from '@/context/types';

export interface StyledSavedTipsListProps {
  tips: SavedTip[];
  searchQuery?: string;
  hasActiveFilters?: boolean;
  onTipPress: (tip: SavedTip) => void;
  onTipLongPress: (tipId: string) => void;
  onClearAll?: () => void;
  showScrollToTop: boolean;
  onScrollToTopChange: (show: boolean) => void;
}

export const StyledSavedTipsList: React.FC<StyledSavedTipsListProps> = ({
  tips,
  searchQuery = '',
  hasActiveFilters = false,
  onTipPress,
  onTipLongPress,
  onClearAll,
  showScrollToTop,
  onScrollToTopChange,
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const flatListRef = useRef<FlatList>(null);
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  // Animate scroll-to-top button visibility
  useEffect(() => {
    Animated.spring(buttonAnimation, {
      toValue: showScrollToTop ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [showScrollToTop, buttonAnimation]);

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

  const renderTipCard = ({ item }: { item: SavedTip }) => (
    <Pressable
      style={styles.tipCard}
      onPress={() => onTipPress(item)}
      onLongPress={() => onTipLongPress(item.id)}
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
      <Text style={styles.emptyTitle}>
        {searchQuery || hasActiveFilters ? 'No Results Found' : 'No Tips Yet'}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery
          ? `No tips match "${searchQuery}"`
          : hasActiveFilters
          ? 'No tips match the selected filters'
          : 'Your saved tips will appear here for quick review and reference.'}
      </Text>
      {!searchQuery && !hasActiveFilters && (
        <Text style={styles.emptyHint}>Look for the bookmark icon on your calculated tips!</Text>
      )}
    </View>
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const scrollThreshold = 200;
    onScrollToTopChange(scrollPosition > scrollThreshold);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <>
      {/* Header Row */}
      {tips.length > 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.countText}>
            {tips.length} {tips.length === 1 ? 'Tip' : 'Tips'}
            {searchQuery ? ' Found' : ' Saved'}
          </Text>
          {!searchQuery && onClearAll && (
            <Pressable onPress={onClearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </Pressable>
          )}
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={tips}
        renderItem={renderTipCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Scroll to Top Button */}
      <Animated.View
        style={[
          styles.scrollToTopButton,
          {
            opacity: buttonAnimation,
            transform: [
              {
                scale: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable onPress={scrollToTop} style={styles.scrollToTopIcon}>
          <StyledIcons
            type="Feather"
            name="arrow-up"
            size={24}
            color={styles.scrollToTopIcon.color}
          />
        </Pressable>
      </Animated.View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
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
  scrollToTopButton: {
    position: 'absolute',
    backgroundColor: colors.accent,
    width: (UnistylesRuntime.screen.width * 12) / 100,
    height: (UnistylesRuntime.screen.width * 12) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 12) / 100,
    bottom: UnistylesRuntime.insets.bottom + (UnistylesRuntime.screen.height * 2) / 100,
    right: (UnistylesRuntime.screen.width * 5) / 100,
    elevation: 5,
    shadowColor: colors.card_typography,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  scrollToTopIcon: {
    color: colors.backgroundColor,
    width: (UnistylesRuntime.screen.width * 12) / 100,
    height: (UnistylesRuntime.screen.width * 12) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 12) / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
