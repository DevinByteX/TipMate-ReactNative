import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ScrollView,
} from 'react-native';
// Custom Component
import { StyledHeader, StyledIcons } from '@components';
// Styling
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useAppContext } from '@/context/AppContext';
import { SavedTip } from '@/context/types';
import { useSaveTip } from '@hooks';
import { useNavigation } from '@react-navigation/native';

type PercentageFilter = 'all' | '0-10' | '10-15' | '15-20' | '20+';
type PeopleFilter = 'all' | '1' | '2-4' | '5+';
type DateFilter = 'all' | 'today' | 'week' | 'month';

const SavedTipsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { state } = useAppContext();
  const { deleteTip, clearAllTips } = useSaveTip();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [percentageFilter, setPercentageFilter] = useState<PercentageFilter>('all');
  const [peopleFilter, setPeopleFilter] = useState<PeopleFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const flatListRef = useRef<FlatList>(null);
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  const savedTips = useMemo(() => state.savedTips || [], [state.savedTips]);

  const hasActiveFilters =
    percentageFilter !== 'all' || peopleFilter !== 'all' || dateFilter !== 'all';

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

  // Filter tips based on search query and selected filters
  const filteredTips = useMemo(() => {
    let filtered = [...savedTips];

    // Apply percentage filter
    if (percentageFilter !== 'all') {
      filtered = filtered.filter(tip => {
        const percentage = tip.tipPercentage;
        switch (percentageFilter) {
          case '0-10':
            return percentage >= 0 && percentage <= 10;
          case '10-15':
            return percentage > 10 && percentage <= 15;
          case '15-20':
            return percentage > 15 && percentage <= 20;
          case '20+':
            return percentage > 20;
          default:
            return true;
        }
      });
    }

    // Apply people filter
    if (peopleFilter !== 'all') {
      filtered = filtered.filter(tip => {
        const people = tip.numberOfPeople;
        switch (peopleFilter) {
          case '1':
            return people === 1;
          case '2-4':
            return people >= 2 && people <= 4;
          case '5+':
            return people >= 5;
          default:
            return true;
        }
      });
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(tip => {
        const tipDate = new Date(tip.timestamp);
        switch (dateFilter) {
          case 'today':
            return tipDate >= today;
          case 'week':
            return tipDate >= weekAgo;
          case 'month':
            return tipDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().replace('%', '');
      filtered = filtered.filter(tip => {
        const amountMatch = tip.amount.toString().includes(query);
        const tipMatch = tip.tip.toString().includes(query);
        const totalMatch = tip.total.toString().includes(query);
        const percentageMatch = tip.tipPercentage.toString().includes(query);
        const currencyMatch = tip.currencyCode.toLowerCase().includes(query);
        const dateMatch = formatDate(tip.timestamp).toLowerCase().includes(query);
        const peopleMatch = tip.numberOfPeople.toString().includes(query);

        return (
          amountMatch ||
          tipMatch ||
          totalMatch ||
          percentageMatch ||
          currencyMatch ||
          dateMatch ||
          peopleMatch
        );
      });
    }

    return filtered;
  }, [savedTips, searchQuery, percentageFilter, peopleFilter, dateFilter]);

  const handleDeleteTip = (tipId: string) => {
    Alert.alert('Delete Tip', 'Are you sure you want to delete this tip from your summary?', [
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const scrollThreshold = 200;
    setShowScrollToTop(scrollPosition > scrollThreshold);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const resetFilters = () => {
    setPercentageFilter('all');
    setPeopleFilter('all');
    setDateFilter('all');
  };

  const FilterCapsule = ({
    label,
    isActive,
    onPress,
  }: {
    label: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      style={[styles.filterCapsule, isActive && styles.filterCapsuleActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterCapsuleText, isActive && styles.filterCapsuleTextActive]}>
        {label}
      </Text>
    </Pressable>
  );

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

  return (
    <>
      <StyledHeader
        headerTitle={'Tip Summary'}
        headerSubTitle={'Quick search and review'}
        headerRightIconVisibilty={false}
      />
      <View style={styles.mainContainer}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              autoFocus={false}
              placeholder="Search by amount, tip, date..."
              value={searchQuery}
              maxLength={50}
              style={styles.searchInput}
              selectionColor={styles.searchInput.placeholderTextColor}
              placeholderTextColor={styles.searchInput.placeholderTextColor}
              keyboardType="numeric"
              returnKeyType="search"
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardAppearance={UnistylesRuntime.themeName === 'dark' ? 'dark' : 'light'}
            />
            {savedTips.length > 0 && (
              <Pressable
                style={styles.filterIconButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <StyledIcons
                  type={'MaterialDesignIcons'}
                  name={showFilters ? 'filter-minus' : 'filter-plus'}
                  size={24}
                  color={theme.colors.card}
                />
                {hasActiveFilters && (
                  <View style={styles.filterIconBadge}>
                    <Text style={styles.filterIconBadgeText}>
                      {
                        [
                          percentageFilter !== 'all',
                          peopleFilter !== 'all',
                          dateFilter !== 'all',
                        ].filter(Boolean).length
                      }
                    </Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Capsules */}
        {savedTips.length > 0 && showFilters && (
          <View style={styles.filtersContainer}>
            {/* Percentage Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <StyledIcons
                  type={'MaterialDesignIcons'}
                  name={'percent'}
                  size={16}
                  color={theme.colors.accent}
                />
                <Text style={styles.filterSectionTitle}>Tip %</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <FilterCapsule
                  label="All"
                  isActive={percentageFilter === 'all'}
                  onPress={() => setPercentageFilter('all')}
                />
                <FilterCapsule
                  label="0-10%"
                  isActive={percentageFilter === '0-10'}
                  onPress={() => setPercentageFilter('0-10')}
                />
                <FilterCapsule
                  label="10-15%"
                  isActive={percentageFilter === '10-15'}
                  onPress={() => setPercentageFilter('10-15')}
                />
                <FilterCapsule
                  label="15-20%"
                  isActive={percentageFilter === '15-20'}
                  onPress={() => setPercentageFilter('15-20')}
                />
                <FilterCapsule
                  label="20%+"
                  isActive={percentageFilter === '20+'}
                  onPress={() => setPercentageFilter('20+')}
                />
              </ScrollView>
            </View>

            {/* People Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <StyledIcons
                  type={'Ionicons'}
                  name={'people'}
                  size={16}
                  color={theme.colors.accent}
                />
                <Text style={styles.filterSectionTitle}>People</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <FilterCapsule
                  label="All"
                  isActive={peopleFilter === 'all'}
                  onPress={() => setPeopleFilter('all')}
                />
                <FilterCapsule
                  label="Solo (1)"
                  isActive={peopleFilter === '1'}
                  onPress={() => setPeopleFilter('1')}
                />
                <FilterCapsule
                  label="2-4 People"
                  isActive={peopleFilter === '2-4'}
                  onPress={() => setPeopleFilter('2-4')}
                />
                <FilterCapsule
                  label="5+ People"
                  isActive={peopleFilter === '5+'}
                  onPress={() => setPeopleFilter('5+')}
                />
              </ScrollView>
            </View>

            {/* Date Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <StyledIcons
                  type={'FontAwesome6'}
                  name={'calendar-days'}
                  size={16}
                  color={theme.colors.accent}
                />
                <Text style={styles.filterSectionTitle}>Date</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <FilterCapsule
                  label="All Time"
                  isActive={dateFilter === 'all'}
                  onPress={() => setDateFilter('all')}
                />
                <FilterCapsule
                  label="Today"
                  isActive={dateFilter === 'today'}
                  onPress={() => setDateFilter('today')}
                />
                <FilterCapsule
                  label="This Week"
                  isActive={dateFilter === 'week'}
                  onPress={() => setDateFilter('week')}
                />
                <FilterCapsule
                  label="This Month"
                  isActive={dateFilter === 'month'}
                  onPress={() => setDateFilter('month')}
                />
              </ScrollView>
            </View>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <Pressable style={styles.resetFiltersButton} onPress={resetFilters}>
                <StyledIcons
                  type={'MaterialDesignIcons'}
                  name={'filter-remove'}
                  size={16}
                  color={theme.colors.accent}
                />
                <Text style={styles.resetFiltersText}>Reset Filters</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Header Row */}
        {filteredTips.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.countText}>
              {filteredTips.length} {filteredTips.length === 1 ? 'Tip' : 'Tips'}
              {searchQuery ? ' Found' : ' Saved'}
            </Text>
            {!searchQuery && (
              <Pressable onPress={clearAllTips}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </Pressable>
            )}
          </View>
        )}
        <FlatList
          ref={flatListRef}
          data={filteredTips}
          renderItem={renderTipCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>

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
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  searchContainer: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    backgroundColor: colors.backgroundColor,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    fontSize: 16,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
    placeholderTextColor: colors.accent,
  },
  filterIconButton: {
    backgroundColor: colors.accent,
    width: (UnistylesRuntime.screen.width * 12) / 100,
    height: (UnistylesRuntime.screen.width * 12) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterIconBadge: {
    position: 'absolute',
    top: -(UnistylesRuntime.screen.height * 0.5) / 100,
    right: -(UnistylesRuntime.screen.width * 1) / 100,
    backgroundColor: colors.card,
    minWidth: (UnistylesRuntime.screen.width * 5) / 100,
    height: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 1) / 100,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  filterIconBadgeText: {
    fontSize: 10,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },
  filterToggleContainer: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1) / 100,
    backgroundColor: colors.backgroundColor,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 1.2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 4) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    gap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  filterToggleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
  },
  activeFilterBadge: {
    backgroundColor: colors.accent,
    width: (UnistylesRuntime.screen.width * 5) / 100,
    height: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: (UnistylesRuntime.screen.width * 1) / 100,
  },
  activeFilterBadgeText: {
    fontSize: 11,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card,
  },
  filtersContainer: {
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1) / 100,
  },
  filterSection: {
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: (UnistylesRuntime.screen.width * 2) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 0.8) / 100,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  filterScrollContent: {
    gap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  filterCapsule: {
    backgroundColor: colors.card,
    paddingHorizontal: (UnistylesRuntime.screen.width * 4) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 0.8) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
    borderWidth: 1,
    borderColor: colors.devider,
  },
  filterCapsuleActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterCapsuleText: {
    fontSize: 13,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
  filterCapsuleTextActive: {
    color: colors.card,
  },
  resetFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: (UnistylesRuntime.screen.width * 2) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  resetFiltersText: {
    fontSize: 13,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
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

export default SavedTipsScreen;
