import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { StyledHeader, StyledIcons, StyledAlert } from '@components';
import { useAppContext } from '@/context/AppContext';
import { IndividualSplit } from '@/context/types';
import { toFixedWithoutRounding } from '@hooks';

type CustomSplitRouteParams = {
  CustomSplitScreen: {
    totalBill: number;
    tipPercentage: number;
    currencySymbol: string;
  };
};

const MIN_PEOPLE = 2;
const MAX_PEOPLE = 15;

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createDefaultPerson = (index: number): IndividualSplit => ({
  id: generateId(),
  name: '',
  allocationType: 'remainder',
  value: undefined,
  calculatedAmount: undefined,
});

// Allocation type button component
const AllocationTypeButton = ({
  label,
  isActive,
  onPress,
  theme,
  styles,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  theme: any;
  styles: any;
}) => (
  <Pressable
    style={[styles.allocationTypeButton, isActive && styles.allocationTypeButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.allocationTypeText, isActive && styles.allocationTypeTextActive]}>
      {label}
    </Text>
  </Pressable>
);

// Person card component
const PersonCard = ({
  person,
  index,
  totalPeople,
  currencySymbol,
  onUpdate,
  onRemove,
  t,
  theme,
  styles,
}: {
  person: IndividualSplit;
  index: number;
  totalPeople: number;
  currencySymbol: string;
  onUpdate: (id: string, updates: Partial<IndividualSplit>) => void;
  onRemove: (id: string) => void;
  t: (key: string, options?: any) => string;
  theme: any;
  styles: any;
}) => {
  const canRemove = totalPeople > MIN_PEOPLE;
  const placeholderName = `${t('screens.customSplit.personDefault', { number: index + 1 })} - ${t(
    'screens.customSplit.namePlaceholder',
  )}`;

  const handleAllocationTypeChange = (type: IndividualSplit['allocationType']) => {
    onUpdate(person.id, {
      allocationType: type,
      value: type === 'remainder' ? undefined : undefined,
    });
  };

  const handleValueChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
    const numValue = parseFloat(sanitized);
    onUpdate(person.id, { value: isNaN(numValue) ? undefined : numValue });
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      layout={Layout.springify()}
      style={styles.personCard}
    >
      {/* Card Header: Name + Delete */}
      <View style={styles.personCardHeader}>
        <TextInput
          style={styles.personNameInput}
          value={person.name}
          onChangeText={text => onUpdate(person.id, { name: text })}
          placeholder={placeholderName}
          placeholderTextColor={theme.utils.hexToRGBA(theme.colors.card_typography, 0.4)}
          maxLength={20}
        />
        {canRemove && (
          <Pressable onPress={() => onRemove(person.id)} hitSlop={8}>
            <StyledIcons
              type="MaterialDesignIcons"
              name="close-circle"
              size={22}
              color={theme.colors.error_toast}
            />
          </Pressable>
        )}
      </View>

      {/* Allocation Type Selector */}
      <View style={styles.allocationTypeContainer}>
        <AllocationTypeButton
          label={t('screens.customSplit.fixed')}
          isActive={person.allocationType === 'fixed'}
          onPress={() => handleAllocationTypeChange('fixed')}
          theme={theme}
          styles={styles}
        />
        <AllocationTypeButton
          label={t('screens.customSplit.percentage')}
          isActive={person.allocationType === 'percentage'}
          onPress={() => handleAllocationTypeChange('percentage')}
          theme={theme}
          styles={styles}
        />
        <AllocationTypeButton
          label={t('screens.customSplit.remainder')}
          isActive={person.allocationType === 'remainder'}
          onPress={() => handleAllocationTypeChange('remainder')}
          theme={theme}
          styles={styles}
        />
      </View>

      {/* Value Input (hidden for remainder type) */}
      {person.allocationType !== 'remainder' && (
        <View style={styles.valueInputContainer}>
          <Text style={styles.valueInputPrefix}>
            {person.allocationType === 'fixed' ? currencySymbol : ''}
          </Text>
          <TextInput
            style={styles.valueInput}
            value={person.value !== undefined ? String(person.value) : ''}
            onChangeText={handleValueChange}
            placeholder={
              person.allocationType === 'fixed'
                ? t('screens.customSplit.fixedPlaceholder')
                : t('screens.customSplit.percentagePlaceholder')
            }
            placeholderTextColor={theme.utils.hexToRGBA(theme.colors.card_typography, 0.4)}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'number-pad'}
            returnKeyType="done"
          />
          <Text style={styles.valueInputSuffix}>
            {person.allocationType === 'percentage' ? '%' : ''}
          </Text>
        </View>
      )}

      {/* Remainder indicator */}
      {person.allocationType === 'remainder' && (
        <View style={styles.remainderIndicator}>
          <StyledIcons
            type="MaterialDesignIcons"
            name="account-group"
            size={16}
            color={theme.colors.accent}
          />
          <Text style={styles.remainderText}>{t('screens.customSplit.remainder')}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const CustomSplitScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { dispatch } = useAppContext();
  const route = useRoute<RouteProp<CustomSplitRouteParams, 'CustomSplitScreen'>>();

  const { totalBill = 0, tipPercentage = 0, currencySymbol = '$' } = route.params || {};

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  // Initialize with 2 default people
  const [people, setPeople] = useState<IndividualSplit[]>([
    createDefaultPerson(0),
    createDefaultPerson(1),
  ]);

  const handleUpdatePerson = useCallback((id: string, updates: Partial<IndividualSplit>) => {
    setPeople(prev => prev.map(person => (person.id === id ? { ...person, ...updates } : person)));
  }, []);

  const handleRemovePerson = useCallback((id: string) => {
    setPeople(prev => {
      if (prev.length <= MIN_PEOPLE) return prev;
      return prev.filter(person => person.id !== id);
    });
  }, []);

  const handleAddPerson = useCallback(() => {
    setPeople(prev => {
      if (prev.length >= MAX_PEOPLE) return prev;
      return [...prev, createDefaultPerson(prev.length)];
    });
  }, []);

  // Calculate overall total (bill + tip)
  const overallTotal = useMemo(() => {
    const tip = (tipPercentage / 100) * totalBill;
    return totalBill + tip;
  }, [totalBill, tipPercentage]);

  // Validation computation
  const validation = useMemo(() => {
    let fixedTotal = 0;
    let percentageTotal = 0;
    let remainderCount = 0;

    people.forEach(person => {
      switch (person.allocationType) {
        case 'fixed':
          fixedTotal += person.value || 0;
          break;
        case 'percentage':
          percentageTotal += person.value || 0;
          break;
        case 'remainder':
          remainderCount++;
          break;
      }
    });

    // Convert fixed to percentage of overallTotal for unified comparison
    const fixedPercentage = overallTotal > 0 ? (fixedTotal / overallTotal) * 100 : 0;
    const totalAllocatedPercentage = fixedPercentage + percentageTotal;

    // Remainder people get the leftover
    const remainingPercentage = 100 - totalAllocatedPercentage;

    // Determine status
    let status: 'complete' | 'under' | 'over';
    const tolerance = 0.01;

    if (remainderCount > 0) {
      // With remainder people, they absorb the leftover
      if (totalAllocatedPercentage > 100 + tolerance) {
        status = 'over';
      } else if (remainingPercentage < -tolerance) {
        status = 'over';
      } else {
        status = 'complete';
      }
    } else {
      // No remainder people — must sum to exactly 100%
      if (Math.abs(totalAllocatedPercentage - 100) <= tolerance) {
        status = 'complete';
      } else if (totalAllocatedPercentage < 100) {
        status = 'under';
      } else {
        status = 'over';
      }
    }

    return {
      status,
      totalAllocatedPercentage,
      fixedTotal,
      percentageTotal,
      remainderCount,
      remainingPercentage: Math.max(0, remainingPercentage),
    };
  }, [people, overallTotal]);

  const canSave =
    validation.status === 'complete' && people.length >= MIN_PEOPLE && overallTotal > 0;

  const handleSave = useCallback(() => {
    if (!canSave) return;

    // Set names to defaults for unnamed people
    const namedPeople = people.map((person, index) => ({
      ...person,
      name: person.name.trim() || t('screens.customSplit.personDefault', { number: index + 1 }),
    }));

    dispatch({
      type: 'SET_ACTIVE_SPLIT_CONFIG',
      payload: {
        type: 'custom',
        customSplits: namedPeople,
      },
    });

    navigation.goBack();
  }, [canSave, people, dispatch, navigation, t]);

  // Validation status display
  const getValidationIcon = () => {
    switch (validation.status) {
      case 'complete':
        return { name: 'check-circle' as const, color: '#4CAF50' };
      case 'under':
        return { name: 'alert-circle' as const, color: theme.colors.error_toast };
      case 'over':
        return { name: 'alert' as const, color: '#FF9800' };
    }
  };

  const getValidationText = () => {
    switch (validation.status) {
      case 'complete':
        return t('screens.customSplit.validationComplete');
      case 'under': {
        const remaining = toFixedWithoutRounding(100 - validation.totalAllocatedPercentage, 1);
        return t('screens.customSplit.validationUnder', { remaining: `${remaining}%` });
      }
      case 'over': {
        const excess = toFixedWithoutRounding(validation.totalAllocatedPercentage - 100, 1);
        return t('screens.customSplit.validationOver', { excess: `${excess}%` });
      }
    }
  };

  const validationIcon = getValidationIcon();

  return (
    <>
      <StyledHeader
        headerTitle={t('screens.customSplit.title')}
        headerSubTitle={t('screens.customSplit.subtitle', {
          currency: currencySymbol,
          amount: toFixedWithoutRounding(overallTotal, 2),
        })}
        enableBackButton
        headerRightIconVisibilty={true}
        headerRightIconType={'MaterialDesignIcons'}
        headerRightIconName={'information-outline'}
        headerRightIconColor={theme.colors.accent}
        onHeaderRightIconPress={() => setIsInfoVisible(true)}
      />
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          {/* Total Bill Banner */}
          <View style={styles.totalBillBanner}>
            <Text style={styles.totalBillLabel}>{t('screens.customSplit.totalBillLabel')}</Text>
            <Text style={styles.totalBillAmount}>
              {currencySymbol}
              {toFixedWithoutRounding(overallTotal, 2)}
            </Text>
          </View>

          {/* Person Cards */}
          {people.map((person, index) => (
            <PersonCard
              key={person.id}
              person={person}
              index={index}
              totalPeople={people.length}
              currencySymbol={currencySymbol}
              onUpdate={handleUpdatePerson}
              onRemove={handleRemovePerson}
              t={t}
              theme={theme}
              styles={styles}
            />
          ))}

          {/* Add Person Button */}
          {people.length < MAX_PEOPLE && (
            <Pressable style={styles.addPersonButton} onPress={handleAddPerson}>
              <StyledIcons
                type="MaterialDesignIcons"
                name="plus-circle"
                size={20}
                color={theme.colors.accent}
              />
              <Text style={styles.addPersonText}>{t('screens.customSplit.addPerson')}</Text>
            </Pressable>
          )}
        </ScrollView>

        {/* Sticky Validation Footer */}
        <View style={styles.footerContainer}>
          {/* Validation Status */}
          <View style={styles.validationRow}>
            <StyledIcons
              type="MaterialDesignIcons"
              name={validationIcon.name}
              size={20}
              color={validationIcon.color}
            />
            <Text
              style={[styles.validationText, { color: validationIcon.color }]}
              numberOfLines={1}
            >
              {getValidationText()}
            </Text>
          </View>

          {/* Allocation Breakdown */}
          <View style={styles.breakdownRow}>
            {validation.fixedTotal > 0 && (
              <Text style={styles.breakdownText}>
                {t('screens.customSplit.fixedSummary', {
                  currency: currencySymbol,
                  amount: toFixedWithoutRounding(validation.fixedTotal, 2),
                })}
              </Text>
            )}
            {validation.percentageTotal > 0 && (
              <Text style={styles.breakdownText}>
                {t('screens.customSplit.percentageSummary', {
                  percentage: toFixedWithoutRounding(validation.percentageTotal, 1),
                })}
              </Text>
            )}
            {validation.remainderCount > 0 && (
              <Text style={styles.breakdownText}>
                {t('screens.customSplit.remainderSummary', {
                  count: validation.remainderCount,
                })}
              </Text>
            )}
          </View>

          {/* Save Button */}
          <Pressable
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
              {t('screens.customSplit.saveSplit')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Info Modal */}
      <StyledAlert
        visible={isInfoVisible}
        title={t('screens.customSplit.infoTitle')}
        message={t('screens.customSplit.infoMessage')}
        type="info"
        buttons={[{ text: 'OK', onPress: () => setIsInfoVisible(false) }]}
        onDismiss={() => setIsInfoVisible(false)}
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  flex1: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (UnistylesRuntime.screen.height * 2) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  // Total Bill Banner
  totalBillBanner: {
    backgroundColor: colors.accent,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 4) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalBillLabel: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: '#ffffff',
    opacity: 0.9,
  },
  totalBillAmount: {
    fontSize: 22,
    fontFamily: fonts.Montserrat_Black,
    color: '#ffffff',
  },
  // Person Card
  personCard: {
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    padding: (UnistylesRuntime.screen.width * 4) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  personCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
  },
  personNameInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card_typography,
    padding: 0,
    marginRight: 8,
  },
  // Allocation Type
  allocationTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
  },
  allocationTypeButton: {
    flex: 1,
    paddingVertical: (UnistylesRuntime.screen.height * 0.8) / 100,
    borderRadius: 8,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allocationTypeButtonActive: {
    backgroundColor: colors.accent,
  },
  allocationTypeText: {
    fontSize: 13,
    fontFamily: fonts.Nunito_SemiBold,
    color: colors.card_typography,
  },
  allocationTypeTextActive: {
    color: '#ffffff',
  },
  // Value Input
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: (UnistylesRuntime.screen.height * 0.6) / 100,
  },
  valueInputPrefix: {
    fontSize: 16,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
    marginRight: 4,
  },
  valueInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
    padding: 0,
  },
  valueInputSuffix: {
    fontSize: 16,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
    marginLeft: 4,
  },
  // Remainder Indicator
  remainderIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: (UnistylesRuntime.screen.height * 0.4) / 100,
  },
  remainderText: {
    fontSize: 13,
    fontFamily: fonts.Nunito_Medium,
    color: colors.accent,
  },
  // Add Person
  addPersonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
  },
  addPersonText: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  // Footer
  footerContainer: {
    backgroundColor: colors.card,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 1.5) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 3) / 100,
    borderTopLeftRadius: (UnistylesRuntime.screen.height * 2) / 100,
    borderTopRightRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: (UnistylesRuntime.screen.height * 0.8) / 100,
  },
  validationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
  },
  breakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  breakdownText: {
    fontSize: 12,
    fontFamily: fonts.Nunito_Medium,
    color: colors.card_typography,
  },
  // Save Button
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.disable_button,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: fonts.Nunito_Bold,
    color: '#ffffff',
  },
  saveButtonTextDisabled: {
    color: colors.disable_text,
  },
}));

export default CustomSplitScreen;
