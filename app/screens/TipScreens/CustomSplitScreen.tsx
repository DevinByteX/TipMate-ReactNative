import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { StyledHeader, StyledIcons, StyledAlert } from '@components';
import { useAppContext } from '@/context/AppContext';
import { IndividualSplit, SavedSplitPreset } from '@/context/types';
import { toFixedWithoutRounding } from '@hooks';

type CustomSplitRouteParams = {
  CustomSplitScreen: {
    totalBill: number;
    tipPercentage: number;
    currencySymbol: string;
    presetId?: string;
  };
};

const MIN_PEOPLE = 2;
const MAX_PEOPLE = 15;

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

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
      value: undefined,
      calculatedAmount: undefined,
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
      layout={LinearTransition.springify()}
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
            keyboardType="decimal-pad"
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

const MemoizedPersonCard = React.memo(PersonCard);

// Shaking preset card component for iOS-style delete mode
const ShakingPresetCard = ({
  preset,
  isActive,
  isDeleteMode,
  onPress,
  onLongPress,
  onDelete,
  getPresetSummary,
  t,
  theme,
  styles,
}: {
  preset: SavedSplitPreset;
  isActive: boolean;
  isDeleteMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: (id: string) => void;
  getPresetSummary: (preset: SavedSplitPreset) => string;
  t: (key: string, options?: any) => string;
  theme: any;
  styles: any;
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isDeleteMode) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 80, easing: Easing.linear }),
          withTiming(2, { duration: 80, easing: Easing.linear }),
          withTiming(-2, { duration: 80, easing: Easing.linear }),
          withTiming(0, { duration: 80, easing: Easing.linear }),
        ),
        -1,
        false,
      );
    } else {
      rotation.value = withTiming(0, { duration: 100 });
    }
  }, [isDeleteMode, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, { position: 'relative' }]}>
      <Pressable
        style={[styles.presetCard, isActive && !isDeleteMode && styles.presetCardActive]}
        onPress={isDeleteMode ? undefined : onPress}
        onLongPress={onLongPress}
      >
        <Text
          style={[styles.presetCardName, isActive && !isDeleteMode && styles.presetCardNameActive]}
          numberOfLines={1}
        >
          {preset.name}
        </Text>
        <Text
          style={[
            styles.presetCardPeople,
            isActive && !isDeleteMode && styles.presetCardPeopleActive,
          ]}
        >
          {t('screens.customSplit.presetPeople', {
            count: preset.customSplits.length,
          })}
        </Text>
        <Text
          style={[
            styles.presetCardSummary,
            isActive && !isDeleteMode && styles.presetCardSummaryActive,
          ]}
          numberOfLines={1}
        >
          {getPresetSummary(preset)}
        </Text>
      </Pressable>
      {isDeleteMode && (
        <Pressable
          style={styles.deleteCircleButton}
          onPress={() => onDelete(preset.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('screens.customSplit.deletePresetAccessibilityLabel', {
            name: preset.name,
            defaultValue: `Delete preset ${preset.name}`,
          })}
        >
          <StyledIcons
            type="MaterialDesignIcons"
            name="close-circle"
            size={22}
            color={theme.colors.error_toast}
          />
        </Pressable>
      )}
    </Animated.View>
  );
};

const CustomSplitScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  const route = useRoute<RouteProp<CustomSplitRouteParams, 'CustomSplitScreen'>>();

  const { totalBill = 0, tipPercentage = 0, currencySymbol = '$', presetId } = route.params || {};

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [hasLoadedPresetFromRoute, setHasLoadedPresetFromRoute] = useState(false);
  const [isPresetNameModalVisible, setIsPresetNameModalVisible] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [isDeletePresetVisible, setIsDeletePresetVisible] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
  const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);
  const [isPresetDeleteMode, setIsPresetDeleteMode] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    type: 'name' | 'config' | 'both';
    preset: SavedSplitPreset;
  } | null>(null);

  // Resolve initial people from preset if presetId is provided
  const getInitialPeople = (): IndividualSplit[] => {
    if (presetId) {
      const preset = state.savedSplitPresets.find(p => p.id === presetId);
      if (preset) {
        return preset.customSplits.map(split => ({
          ...split,
          calculatedAmount: undefined,
        }));
      }
    }
    return [createDefaultPerson(0), createDefaultPerson(1)];
  };

  // Initialize with 2 default people or loaded preset
  const [people, setPeople] = useState<IndividualSplit[]>(getInitialPeople);

  // Sync preset loading when presets become available (after async persist load)
  useEffect(() => {
    if (presetId && !hasLoadedPresetFromRoute && state.savedSplitPresets.length > 0) {
      const preset = state.savedSplitPresets.find(p => p.id === presetId);
      if (preset) {
        const loadedPeople = preset.customSplits.map(split => ({
          ...split,
          calculatedAmount: undefined,
        }));
        setPeople(loadedPeople);
        setActivePresetId(presetId);
        setHasLoadedPresetFromRoute(true);
      }
    }
  }, [presetId, state.savedSplitPresets, hasLoadedPresetFromRoute]);

  // Check if the current activeSplitConfig matches any saved preset
  useEffect(() => {
    if (
      state.activeSplitConfig?.type === 'custom' &&
      state.activeSplitConfig?.customSplits &&
      state.savedSplitPresets.length > 0 &&
      !presetId // Only do this if presetId wasn't explicitly provided
    ) {
      const currentSplits = state.activeSplitConfig.customSplits;

      // Find a preset that matches the current config
      const matchingPreset = state.savedSplitPresets.find(preset => {
        if (preset.customSplits.length !== currentSplits.length) return false;

        return preset.customSplits.every((split, index) => {
          const current = currentSplits[index];
          return (
            split.allocationType === current.allocationType &&
            split.value === current.value &&
            split.name === current.name
          );
        });
      });

      if (matchingPreset) {
        setActivePresetId(matchingPreset.id);
      }
    }
  }, [state.activeSplitConfig, state.savedSplitPresets, presetId]);

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

  // Clear active custom split and go back to equal splitting
  const isCustomSplitCurrentlyActive = state.activeSplitConfig?.type === 'custom';

  const handleClearCustomSplit = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_SPLIT_CONFIG' });
    navigation.goBack();
  }, [dispatch, navigation]);

  // Load a preset into the editor
  const handleLoadPreset = useCallback(
    (preset: SavedSplitPreset) => {
      if (isPresetDeleteMode) return;
      const loadedPeople = preset.customSplits.map(split => ({
        ...split,
        calculatedAmount: undefined,
      }));
      setPeople(loadedPeople);
      setActivePresetId(preset.id);
    },
    [isPresetDeleteMode],
  );

  // Toggle preset selection: deselect if already active, load if not
  const handlePresetPress = useCallback(
    (preset: SavedSplitPreset) => {
      if (isPresetDeleteMode) return;
      if (activePresetId === preset.id) {
        // Deselect the preset
        setActivePresetId(null);
      } else {
        // Load the preset
        handleLoadPreset(preset);
      }
    },
    [activePresetId, isPresetDeleteMode, handleLoadPreset],
  );

  // Clear active preset and reset to blank state
  const handleClearPreset = useCallback(() => {
    setActivePresetId(null);
    setPeople([createDefaultPerson(0), createDefaultPerson(1)]);
  }, []);

  // Check for duplicate presets (name match, config match, or both)
  const findDuplicatePreset = useCallback(
    (
      name: string,
      splits: IndividualSplit[],
    ): { type: 'name' | 'config' | 'both'; preset: SavedSplitPreset } | null => {
      const lowerName = name.toLowerCase();

      const isSameConfig = (a: IndividualSplit[], b: IndividualSplit[]) => {
        if (a.length !== b.length) return false;
        return a.every(
          (split, i) =>
            split.allocationType === b[i].allocationType &&
            split.value === b[i].value &&
            split.name === b[i].name,
        );
      };

      for (const existing of state.savedSplitPresets) {
        const nameMatch = existing.name.toLowerCase() === lowerName;
        const configMatch = isSameConfig(splits, existing.customSplits);

        if (nameMatch && configMatch) return { type: 'both', preset: existing };
        if (nameMatch) return { type: 'name', preset: existing };
        if (configMatch) return { type: 'config', preset: existing };
      }

      return null;
    },
    [state.savedSplitPresets],
  );

  // Get named people (fills in default names for unnamed)
  const getNamedPeople = useCallback(() => {
    return people.map((person, index) => ({
      ...person,
      name: person.name.trim() || t('screens.customSplit.personDefault', { number: index + 1 }),
      calculatedAmount: undefined,
    }));
  }, [people, t]);

  // Save as new preset
  const handleSavePreset = useCallback(() => {
    if (!canSave) return;
    const trimmedName = presetNameInput.trim();
    if (!trimmedName) return;

    const namedPeople = getNamedPeople();

    // Check for duplicates before saving
    const duplicate = findDuplicatePreset(trimmedName, namedPeople);
    if (duplicate) {
      setIsPresetNameModalVisible(false);
      setDuplicateAlert(duplicate);
      return;
    }

    const now = Date.now();

    const newPreset: SavedSplitPreset = {
      id: generateId(),
      name: trimmedName,
      createdAt: now,
      updatedAt: now,
      customSplits: namedPeople,
    };

    dispatch({ type: 'SAVE_SPLIT_PRESET', payload: newPreset });
    setActivePresetId(newPreset.id);
    setIsPresetNameModalVisible(false);
    setPresetNameInput('');
    Toast.show({ type: 'success', text1: t('screens.customSplit.presetSaved') });
  }, [canSave, presetNameInput, getNamedPeople, findDuplicatePreset, dispatch, t]);

  // Update existing preset
  const handleUpdatePreset = useCallback(() => {
    if (!canSave || !activePresetId) return;

    const existingPreset = state.savedSplitPresets.find(p => p.id === activePresetId);
    if (!existingPreset) return;

    const namedPeople = getNamedPeople();

    const updatedPreset: SavedSplitPreset = {
      ...existingPreset,
      updatedAt: Date.now(),
      customSplits: namedPeople,
    };

    dispatch({ type: 'UPDATE_SPLIT_PRESET', payload: updatedPreset });
    Toast.show({ type: 'success', text1: t('screens.customSplit.presetUpdated') });
  }, [canSave, activePresetId, state.savedSplitPresets, getNamedPeople, dispatch, t]);

  // Delete a preset
  const handleDeletePreset = useCallback(() => {
    if (!presetToDelete) return;
    // Check if this is the last preset before dispatching
    const remainingPresetsCount = state.savedSplitPresets.filter(
      p => p.id !== presetToDelete,
    ).length;
    dispatch({ type: 'DELETE_SPLIT_PRESET', payload: presetToDelete });
    if (activePresetId === presetToDelete) {
      setActivePresetId(null);
    }
    setPresetToDelete(null);
    setIsDeletePresetVisible(false);
    // Exit delete mode if no presets remain after deletion
    if (remainingPresetsCount <= 0) {
      setIsPresetDeleteMode(false);
    }
    Toast.show({ type: 'success', text1: t('screens.customSplit.presetDeleted') });
  }, [presetToDelete, activePresetId, dispatch, t, state.savedSplitPresets]);

  // Exit delete mode when all presets are deleted
  useEffect(() => {
    if (isPresetDeleteMode && state.savedSplitPresets.length === 0) {
      setIsPresetDeleteMode(false);
    }
  }, [state.savedSplitPresets.length, isPresetDeleteMode]);

  // Handle long press on preset card — enter delete mode
  const handlePresetLongPress = useCallback(() => {
    setIsPresetDeleteMode(true);
  }, []);

  // Handle delete button press on a preset card
  const handlePresetDeletePress = useCallback((id: string) => {
    setPresetToDelete(id);
    setIsDeletePresetVisible(true);
  }, []);

  // Get brief summary text for a preset
  const getPresetSummary = useCallback(
    (preset: SavedSplitPreset) => {
      const counts = { fixed: 0, percentage: 0, remainder: 0 };
      preset.customSplits.forEach(s => {
        counts[s.allocationType]++;
      });
      const parts: string[] = [];
      if (counts.fixed > 0) parts.push(`${counts.fixed} ${t('screens.customSplit.fixed')}`);
      if (counts.percentage > 0) parts.push(`${counts.percentage} %`);
      if (counts.remainder > 0)
        parts.push(`${counts.remainder} ${t('screens.customSplit.remainder')}`);
      return parts.join(', ');
    },
    [t],
  );

  // Validation status display
  const getValidationIcon = () => {
    switch (validation.status) {
      case 'complete':
        return { name: 'check-circle' as const, color: theme.colors.success };
      case 'under':
        return { name: 'alert-circle' as const, color: theme.colors.error_toast };
      case 'over':
        return { name: 'alert' as const, color: theme.colors.warning };
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
        headerSubTitle={t('screens.customSplit.subTitle')}
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
          onScrollBeginDrag={() => {
            if (isPresetDeleteMode) setIsPresetDeleteMode(false);
          }}
        >
          {/* Total Bill Banner */}
          <Pressable
            style={styles.totalBillBanner}
            onPress={() => {
              if (isPresetDeleteMode) setIsPresetDeleteMode(false);
            }}
          >
            <Text style={styles.totalBillLabel}>{t('screens.customSplit.totalBillLabel')}</Text>
            <Text style={styles.totalBillAmount}>
              {currencySymbol}
              {toFixedWithoutRounding(overallTotal, 2)}
            </Text>
          </Pressable>

          {/* Saved Presets Section */}
          {state.savedSplitPresets.length > 0 && (
            <View style={styles.presetsSection}>
              <Pressable
                style={styles.presetsSectionHeader}
                onPress={() => {
                  if (isPresetDeleteMode) {
                    setIsPresetDeleteMode(false);
                  } else {
                    setIsPresetsExpanded(!isPresetsExpanded);
                  }
                }}
              >
                <Text style={styles.presetsSectionTitle}>
                  {t('screens.customSplit.savedPresets')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {isPresetDeleteMode && (
                    <Pressable onPress={() => setIsPresetDeleteMode(false)}>
                      <Text style={styles.doneButtonText}>
                        {t('common.done', { defaultValue: 'Done' })}
                      </Text>
                    </Pressable>
                  )}
                  <StyledIcons
                    type="MaterialDesignIcons"
                    name={isPresetsExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.accent}
                  />
                </View>
              </Pressable>
              {isPresetsExpanded && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.presetsScrollContent}
                >
                  {state.savedSplitPresets.map(preset => (
                    <ShakingPresetCard
                      key={preset.id}
                      preset={preset}
                      isActive={activePresetId === preset.id}
                      isDeleteMode={isPresetDeleteMode}
                      onPress={() => handlePresetPress(preset)}
                      onLongPress={handlePresetLongPress}
                      onDelete={handlePresetDeletePress}
                      getPresetSummary={getPresetSummary}
                      t={t}
                      theme={theme}
                      styles={styles}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Dismiss delete mode on tap outside presets */}
          <Pressable
            onPress={() => {
              if (isPresetDeleteMode) setIsPresetDeleteMode(false);
            }}
            accessible={false}
          >
            {/* Person Cards */}
            {people.map((person, index) => (
              <MemoizedPersonCard
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
          </Pressable>
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

          {/* Clear Custom Split Button */}
          {isCustomSplitCurrentlyActive && (
            <Pressable style={styles.clearActiveSplitButton} onPress={handleClearCustomSplit}>
              <StyledIcons
                type="MaterialDesignIcons"
                name="close-circle"
                size={16}
                color={theme.colors.error_toast}
              />
              <Text style={styles.clearActiveSplitText}>
                {t('screens.customSplit.clearActiveSplit')}
              </Text>
            </Pressable>
          )}

          {/* Save Button */}
          <View style={styles.footerButtonRow}>
            <Pressable
              style={[styles.saveButton, styles.applyButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                {t('screens.customSplit.applySplit')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.presetButton, !canSave && styles.presetButtonDisabled]}
              onPress={() => {
                if (activePresetId) {
                  handleUpdatePreset();
                } else {
                  setPresetNameInput('');
                  setIsPresetNameModalVisible(true);
                }
              }}
              disabled={!canSave}
            >
              <Text style={[styles.presetButtonText, !canSave && styles.presetButtonTextDisabled]}>
                {activePresetId
                  ? t('screens.customSplit.updatePreset')
                  : t('screens.customSplit.saveAsPreset')}
              </Text>
            </Pressable>
          </View>
          {/* Save as New option when editing a preset */}
          {activePresetId && canSave && (
            <Pressable
              style={styles.saveAsNewButton}
              onPress={() => {
                setPresetNameInput('');
                setIsPresetNameModalVisible(true);
              }}
            >
              <Text style={styles.saveAsNewText}>{t('screens.customSplit.saveAsNew')}</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Info Modal */}
      <StyledAlert
        visible={isInfoVisible}
        title={t('screens.customSplit.infoTitle')}
        message={t('screens.customSplit.infoMessage')}
        type="info"
        buttons={[{ text: t('common.ok'), onPress: () => setIsInfoVisible(false) }]}
        onDismiss={() => setIsInfoVisible(false)}
      />

      {/* Preset Name Modal */}
      <StyledAlert
        visible={isPresetNameModalVisible}
        title={t('screens.customSplit.presetNameTitle')}
        type="info"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {
              setIsPresetNameModalVisible(false);
              setPresetNameInput('');
            },
          },
          {
            text: t('common.save'),
            onPress: () => {
              if (presetNameInput.trim()) {
                handleSavePreset();
              } else {
                Toast.show({ type: 'error', text1: t('screens.customSplit.presetNameRequired') });
              }
            },
          },
        ]}
        onDismiss={() => {
          setIsPresetNameModalVisible(false);
          setPresetNameInput('');
        }}
      >
        <TextInput
          style={styles.presetNameInput}
          value={presetNameInput}
          onChangeText={setPresetNameInput}
          placeholder={t('screens.customSplit.presetNamePlaceholder')}
          placeholderTextColor={theme.utils.hexToRGBA(theme.colors.card_typography, 0.4)}
          maxLength={30}
          autoFocus
        />
      </StyledAlert>

      {/* Duplicate Preset Alert */}
      <StyledAlert
        visible={duplicateAlert !== null}
        title={
          duplicateAlert?.type === 'name'
            ? t('screens.customSplit.duplicateNameTitle')
            : duplicateAlert?.type === 'config'
            ? t('screens.customSplit.duplicateConfigTitle')
            : t('screens.customSplit.duplicateBothTitle')
        }
        message={
          duplicateAlert?.type === 'name'
            ? t('screens.customSplit.duplicateNameMessage', {
                name: duplicateAlert.preset.name,
              })
            : duplicateAlert?.type === 'config'
            ? t('screens.customSplit.duplicateConfigMessage', {
                name: duplicateAlert?.preset.name,
              })
            : t('screens.customSplit.duplicateBothMessage', {
                name: duplicateAlert?.preset.name,
              })
        }
        type="warning"
        buttons={
          duplicateAlert?.type === 'name'
            ? [
                {
                  text: t('common.ok'),
                  onPress: () => {
                    setDuplicateAlert(null);
                    setIsPresetNameModalVisible(true);
                  },
                },
              ]
            : [
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                  onPress: () => {
                    setDuplicateAlert(null);
                    setPresetNameInput('');
                  },
                },
                {
                  text: t('screens.customSplit.loadPreset'),
                  onPress: () => {
                    if (duplicateAlert) {
                      handleLoadPreset(duplicateAlert.preset);
                    }
                    setDuplicateAlert(null);
                    setPresetNameInput('');
                  },
                },
              ]
        }
        onDismiss={() => {
          setDuplicateAlert(null);
          setPresetNameInput('');
        }}
      />

      {/* Delete Preset Confirmation */}
      <StyledAlert
        visible={isDeletePresetVisible}
        title={t('screens.customSplit.deletePresetTitle')}
        message={t('screens.customSplit.deletePresetConfirm')}
        type="confirm"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {
              setIsDeletePresetVisible(false);
              setPresetToDelete(null);
            },
          },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: handleDeletePreset,
          },
        ]}
        onDismiss={() => {
          setIsDeletePresetVisible(false);
          setPresetToDelete(null);
        }}
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, utils }) => ({
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
  // Active Preset Info Bar
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
    color: colors.white,
    opacity: 0.9,
  },
  totalBillAmount: {
    fontSize: 22,
    fontFamily: fonts.Montserrat_Black,
    color: colors.white,
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
    color: colors.white,
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
    color: colors.white,
  },
  saveButtonTextDisabled: {
    color: colors.disable_text,
  },
  // Footer button row
  footerButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  applyButton: {
    flex: 1,
  },
  presetButton: {
    flex: 1,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  },
  presetButtonDisabled: {
    borderColor: colors.disable_button,
  },
  presetButtonText: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  presetButtonTextDisabled: {
    color: colors.disable_text,
  },
  saveAsNewButton: {
    alignItems: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 1.2) / 100,
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
    minHeight: 44,
    justifyContent: 'center',
  },
  saveAsNewText: {
    fontSize: 13,
    fontFamily: fonts.Nunito_SemiBold,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  clearActiveSplitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 0.8) / 100,
    borderWidth: 1,
    borderColor: colors.error_toast,
  },
  clearActiveSplitText: {
    fontSize: 13,
    fontFamily: fonts.Nunito_Bold,
    color: colors.error_toast,
  },
  // Presets section
  presetsSection: {
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  presetsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: (UnistylesRuntime.screen.height * 1) / 100,
  },
  presetsSectionTitle: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  presetsScrollContent: {
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  deleteCircleButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  presetCard: {
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    padding: (UnistylesRuntime.screen.width * 3) / 100,
    minWidth: (UnistylesRuntime.screen.width * 35) / 100,
    maxWidth: (UnistylesRuntime.screen.width * 50) / 100,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  presetCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  presetCardName: {
    fontSize: 14,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card_typography,
    marginBottom: 2,
  },
  presetCardNameActive: {
    color: colors.white,
  },
  presetCardPeople: {
    fontSize: 12,
    fontFamily: fonts.Nunito_Medium,
    color: colors.card_typography,
    opacity: 0.7,
  },
  presetCardPeopleActive: {
    color: colors.white,
    opacity: 0.9,
  },
  presetCardSummary: {
    fontSize: 11,
    fontFamily: fonts.Nunito_Medium,
    color: colors.card_typography,
    opacity: 0.5,
    marginTop: 2,
  },
  presetCardSummaryActive: {
    color: colors.white,
    opacity: 0.7,
  },
  // Active Preset Info Bar
  activePresetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: utils.hexToRGBA(colors.accent, 0.15),
    paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 0.8) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 0.8) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1.2) / 100,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  activePresetText: {
    fontSize: 12,
    fontFamily: fonts.Nunito_SemiBold,
    color: colors.accent,
    flex: 1,
  },
  activePresetName: {
    fontSize: 12,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: utils.hexToRGBA(colors.error_toast, 0.15),
    borderWidth: 1,
    borderColor: colors.error_toast,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: fonts.Nunito_Bold,
    color: colors.error_toast,
  },
  // Preset name input in modal
  presetNameInput: {
    width: '100%',
    fontSize: 16,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card_typography,
    backgroundColor: colors.backgroundColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));

export default CustomSplitScreen;
