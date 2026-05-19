import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
// Custom Component
import {
  StyledHeader,
  StyledIcons,
  StyledAlert,
  StyledSavedTipsList,
  StyledFilterCapsule,
  type PercentageFilter,
  type PeopleFilter,
  type DateFilter,
} from '@components';
// Styling
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useHistory, useUserSettings } from '@/context/AppContext';
import { SavedTip } from '@/context/types';
import { useSaveTip } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import { getLocaleForFormatting } from '@/localization';

const SavedTipsScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { state: historyState } = useHistory();
  const { state: settingsState } = useUserSettings();
  const { t } = useTranslation();
  const {
    deleteTip,
    clearAllTips,
    confirmClearAllTips,
    clearAllAlert,
    deleteErrorAlert,
    clearErrorAlert,
    dismissClearAll,
    dismissDeleteError,
    dismissClearError,
  } = useSaveTip();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [percentageFilter, setPercentageFilter] = useState<PercentageFilter>('all');
  const [peopleFilter, setPeopleFilter] = useState<PeopleFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [pendingDeleteTipId, setPendingDeleteTipId] = useState<string | null>(null);

  const savedTips = useMemo(() => historyState.savedTips || [], [historyState.savedTips]);

  const hasActiveFilters =
    percentageFilter !== 'all' || peopleFilter !== 'all' || dateFilter !== 'all';

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
        const date = new Date(tip.timestamp);
        const dateString = date.toLocaleDateString(getLocaleForFormatting(settingsState.language), {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const dateMatch = dateString.toLowerCase().includes(query);
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
    setPendingDeleteTipId(tipId);
    setIsDeleteAlertVisible(true);
  };

  const confirmDeleteTip = () => {
    if (pendingDeleteTipId) {
      deleteTip(pendingDeleteTipId);
      setPendingDeleteTipId(null);
      setIsDeleteAlertVisible(false);
    }
  };

  const handleTipPress = (tip: SavedTip) => {
    navigation.navigate('SavedTipDetailScreen', { tip });
  };

  const resetFilters = () => {
    setPercentageFilter('all');
    setPeopleFilter('all');
    setDateFilter('all');
  };

  return (
    <>
      <StyledHeader
        headerTitle={t('screens.savedTips.title')}
        headerSubTitle={t('screens.savedTips.subtitle')}
        headerRightIconVisibilty={false}
      />
      <View style={styles.mainContainer}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              autoFocus={false}
              placeholder={t('screens.savedTips.searchPlaceholder')}
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
        <StyledFilterCapsule
          visible={savedTips.length > 0 && showFilters}
          percentageFilter={percentageFilter}
          peopleFilter={peopleFilter}
          dateFilter={dateFilter}
          onPercentageFilterChange={setPercentageFilter}
          onPeopleFilterChange={setPeopleFilter}
          onDateFilterChange={setDateFilter}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <Animated.View
          layout={LinearTransition.springify().damping(20).stiffness(70)}
          style={styles.listWrapper}
        >
          <StyledSavedTipsList
            tips={filteredTips}
            searchQuery={searchQuery}
            hasActiveFilters={hasActiveFilters}
            onTipPress={handleTipPress}
            onItemSwipeLeft={handleDeleteTip}
            onClearAll={clearAllTips}
            showScrollToTop={showScrollToTop}
            onScrollToTopChange={setShowScrollToTop}
          />
        </Animated.View>
      </View>

      {/* Delete Confirmation Alert */}
      <StyledAlert
        visible={isDeleteAlertVisible}
        customIcon={{ iconType: 'MaterialDesignIcons', iconName: 'delete-outline' }}
        title={t('common.delete')}
        message={t('screens.savedTipDetail.confirmDelete')}
        type="confirm"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {
              setPendingDeleteTipId(null);
              setIsDeleteAlertVisible(false);
            },
          },
          { text: t('common.delete'), style: 'destructive', onPress: confirmDeleteTip },
        ]}
        onDismiss={() => {
          setPendingDeleteTipId(null);
          setIsDeleteAlertVisible(false);
        }}
      />

      {/* Clear All Confirmation Alert */}
      <StyledAlert
        visible={clearAllAlert}
        customIcon={{ iconType: 'MaterialDesignIcons', iconName: 'delete-outline' }}
        title={t('messages.clearAllTitle')}
        message={t('messages.clearAllMessage')}
        type="confirm"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: dismissClearAll,
          },
          { text: t('messages.deleteAll'), style: 'destructive', onPress: confirmClearAllTips },
        ]}
        onDismiss={dismissClearAll}
      />

      {/* Delete Error Alert */}
      <StyledAlert
        visible={deleteErrorAlert}
        title={t('common.error')}
        message={t('messages.deleteError')}
        type="error"
        buttons={[{ text: t('common.ok'), style: 'default', onPress: dismissDeleteError }]}
        onDismiss={dismissDeleteError}
      />

      {/* Clear Error Alert */}
      <StyledAlert
        visible={clearErrorAlert}
        title={t('common.error')}
        message={t('messages.clearError')}
        type="error"
        buttons={[{ text: t('common.ok'), style: 'default', onPress: dismissClearError }]}
        onDismiss={dismissClearError}
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  listWrapper: {
    flex: 1,
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
}));

export default SavedTipsScreen;
