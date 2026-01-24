import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { StyledIcons } from '@components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

export type PercentageFilter = 'all' | '0-10' | '10-15' | '15-20' | '20+';
export type PeopleFilter = 'all' | '1' | '2-4' | '5+';
export type DateFilter = 'all' | 'today' | 'week' | 'month';

export interface StyledFilterCapsuleProps {
  visible: boolean;
  percentageFilter: PercentageFilter;
  peopleFilter: PeopleFilter;
  dateFilter: DateFilter;
  onPercentageFilterChange: (filter: PercentageFilter) => void;
  onPeopleFilterChange: (filter: PeopleFilter) => void;
  onDateFilterChange: (filter: DateFilter) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const StyledFilterCapsule: React.FC<StyledFilterCapsuleProps> = ({
  visible,
  percentageFilter,
  peopleFilter,
  dateFilter,
  onPercentageFilterChange,
  onPeopleFilterChange,
  onDateFilterChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();

  if (!visible) return null;

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

  return (
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
          <Text style={styles.filterSectionTitle}>{t('filters.tipPercent')}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterCapsule
            label={t('filters.all')}
            isActive={percentageFilter === 'all'}
            onPress={() => onPercentageFilterChange('all')}
          />
          <FilterCapsule
            label="0-10%"
            isActive={percentageFilter === '0-10'}
            onPress={() => onPercentageFilterChange('0-10')}
          />
          <FilterCapsule
            label="10-15%"
            isActive={percentageFilter === '10-15'}
            onPress={() => onPercentageFilterChange('10-15')}
          />
          <FilterCapsule
            label="15-20%"
            isActive={percentageFilter === '15-20'}
            onPress={() => onPercentageFilterChange('15-20')}
          />
          <FilterCapsule
            label="20%+"
            isActive={percentageFilter === '20+'}
            onPress={() => onPercentageFilterChange('20+')}
          />
        </ScrollView>
      </View>

      {/* People Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <StyledIcons type={'Ionicons'} name={'people'} size={16} color={theme.colors.accent} />
          <Text style={styles.filterSectionTitle}>{t('filters.people')}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterCapsule
            label={t('filters.all')}
            isActive={peopleFilter === 'all'}
            onPress={() => onPeopleFilterChange('all')}
          />
          <FilterCapsule
            label={t('filters.solo')}
            isActive={peopleFilter === '1'}
            onPress={() => onPeopleFilterChange('1')}
          />
          <FilterCapsule
            label={t('filters.twoPlusToFour')}
            isActive={peopleFilter === '2-4'}
            onPress={() => onPeopleFilterChange('2-4')}
          />
          <FilterCapsule
            label={t('filters.fivePlus')}
            isActive={peopleFilter === '5+'}
            onPress={() => onPeopleFilterChange('5+')}
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
          <Text style={styles.filterSectionTitle}>{t('filters.date')}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterCapsule
            label={t('filters.allTime')}
            isActive={dateFilter === 'all'}
            onPress={() => onDateFilterChange('all')}
          />
          <FilterCapsule
            label={t('filters.today')}
            isActive={dateFilter === 'today'}
            onPress={() => onDateFilterChange('today')}
          />
          <FilterCapsule
            label={t('filters.thisWeek')}
            isActive={dateFilter === 'week'}
            onPress={() => onDateFilterChange('week')}
          />
          <FilterCapsule
            label={t('filters.thisMonth')}
            isActive={dateFilter === 'month'}
            onPress={() => onDateFilterChange('month')}
          />
        </ScrollView>
      </View>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Pressable style={styles.resetFiltersButton} onPress={onResetFilters}>
          <StyledIcons
            type={'MaterialDesignIcons'}
            name={'filter-remove'}
            size={16}
            color={theme.colors.accent}
          />
          <Text style={styles.resetFiltersText}>{t('filters.resetFilters')}</Text>
        </Pressable>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
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
}));
