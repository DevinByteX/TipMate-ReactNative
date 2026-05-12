import React, { useState, useCallback } from 'react';
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
import Toast from 'react-native-toast-message';
import {
  StyledHeader,
  StyledIcons,
  StyledAlert,
  StyledCustomSplitPersonCard,
  StyledCustomSplitPresetCard,
} from '@components';
import { useAppContext } from '@/context/AppContext';
import { SavedSplitPreset } from '@/context/types';
import {
  toFixedWithoutRounding,
  useCustomSplitPeople,
  useCustomSplitValidation,
  useSplitPresets,
  usePresetDuplication,
} from '@hooks';
import { IndividualSplit } from '@/context/types';

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

const CustomSplitScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { state, dispatch } = useAppContext();
  const route = useRoute<RouteProp<CustomSplitRouteParams, 'CustomSplitScreen'>>();

  const { totalBill = 0, tipPercentage = 0, currencySymbol = '$' } = route.params || {};

  // Import hooks
  const {
    people,
    setPeople,
    handleUpdatePerson,
    handleRemovePerson,
    handleAddPerson,
    createDefaultPerson,
  } = useCustomSplitPeople();

  const { overallTotal, validation, canSave, getValidationIcon, getValidationText } =
    useCustomSplitValidation(people, totalBill, tipPercentage, theme, t);

  const {
    activePresetId,
    setActivePresetId,
    isPresetsExpanded,
    setIsPresetsExpanded,
    isPresetDeleteMode,
    setIsPresetDeleteMode,
    handleLoadPreset: hLoadPreset,
    handlePresetPress,
    handleClearPreset,
    handlePresetLongPress,
  } = useSplitPresets();

  const {
    isPresetNameModalVisible,
    setIsPresetNameModalVisible,
    presetNameInput,
    setPresetNameInput,
    isDeletePresetVisible,
    setIsDeletePresetVisible,
    presetToDelete,
    setPresetToDelete,
    duplicateAlert,
    setDuplicateAlert,
    handleSavePreset: hSavePreset,
    handleUpdatePreset: hUpdatePreset,
    handleDeletePreset: hDeletePreset,
    getNamedPeople,
  } = usePresetDuplication();

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  // Wrapper for handleLoadPreset to pass people update
  const handleLoadPreset = useCallback(
    (preset: SavedSplitPreset) => {
      hLoadPreset(preset, setPeople);
    },
    [hLoadPreset],
  );

  // Wrapper for handlePresetPress
  const handlePresetPressWrapper = useCallback(
    (preset: SavedSplitPreset) => {
      handlePresetPress(preset, setPeople);
    },
    [handlePresetPress],
  );

  // Main save handler
  const handleSave = useCallback(() => {
    if (!canSave) return;

    const namedPeople = getNamedPeople(people, t);

    dispatch({
      type: 'SET_ACTIVE_SPLIT_CONFIG',
      payload: {
        type: 'custom',
        customSplits: namedPeople,
      },
    });

    navigation.goBack();
  }, [canSave, people, getNamedPeople, t, dispatch, navigation]);

  // Clear custom split
  const isCustomSplitCurrentlyActive = state.activeSplitConfig?.type === 'custom';
  const handleClearCustomSplit = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_SPLIT_CONFIG' });
    navigation.goBack();
  }, [dispatch, navigation]);

  // Get preset summary
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

  // Preset delete handler
  const handlePresetDeletePress = useCallback((id: string) => {
    setPresetToDelete(id);
    setIsDeletePresetVisible(true);
  }, []);

  // Handle save preset with wrapper
  const handleSavePresetWrapper = useCallback(() => {
    hSavePreset(people, t, () => {
      setActivePresetId(null);
    });
  }, [hSavePreset, people, t]);

  // Handle update preset with wrapper
  const handleUpdatePresetWrapper = useCallback(() => {
    hUpdatePreset(people, activePresetId, t);
  }, [hUpdatePreset, people, activePresetId, t]);

  // Handle delete preset with wrapper
  const handleDeletePresetWrapper = useCallback(() => {
    hDeletePreset(t, () => {
      if (activePresetId === presetToDelete) {
        setActivePresetId(null);
      }
    });
  }, [hDeletePreset, t, activePresetId, presetToDelete]);

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
                    <StyledCustomSplitPresetCard
                      key={preset.id}
                      preset={preset}
                      isActive={activePresetId === preset.id}
                      isDeleteMode={isPresetDeleteMode}
                      onPress={() => handlePresetPressWrapper(preset)}
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

          {/* Person Cards */}
          <Pressable
            onPress={() => {
              if (isPresetDeleteMode) setIsPresetDeleteMode(false);
            }}
            accessible={false}
          >
            {people.map((person: IndividualSplit, index: number) => (
              <StyledCustomSplitPersonCard
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
          {/* Display clear button if custom split is currently active */}
          {isCustomSplitCurrentlyActive && (
            <Pressable style={styles.clearActiveSplitButton} onPress={handleClearCustomSplit}>
              <StyledIcons
                type="MaterialDesignIcons"
                name="close"
                size={16}
                color={theme.colors.error_toast}
              />
              <Text style={styles.clearActiveSplitText}>
                {t('screens.customSplit.clearActiveSplit')}
              </Text>
            </Pressable>
          )}

          {/* Validation Row */}
          <View style={styles.validationRow}>
            <StyledIcons
              type="MaterialDesignIcons"
              name={getValidationIcon().name}
              size={20}
              color={getValidationIcon().color}
            />
            <Text
              style={[styles.validationText, { color: getValidationIcon().color }]}
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
                  handleUpdatePresetWrapper();
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
                handleSavePresetWrapper();
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
            onPress: handleDeletePresetWrapper,
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
