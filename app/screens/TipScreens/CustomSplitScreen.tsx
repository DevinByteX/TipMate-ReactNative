import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  StyledHeader,
  StyledIcons,
  StyledAlert,
  StyledCustomSplitPersonCard,
  StyledCustomSplitPresetCard,
} from '@components';
import { useCustomSplitEditor } from '@hooks';
import { toFixedWithoutRounding } from '@utils';
import { IndividualSplit } from '@/context/types';
import type { RootStackParamList } from '@navigation/types';

const CustomSplitScreen = () => {
  const { styles, theme } = useStyles(stylesheet);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'CustomSplitScreen'>>();
  const { totalBill = 0, tipPercentage = 0, currencySymbol = '$' } = route.params || {};

  const { people, presets, validation, isCustomSplitActive, actions } = useCustomSplitEditor(
    totalBill,
    tipPercentage,
  );

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const handleSave = () => {
    actions.save();
    navigation.goBack();
  };

  const handleClear = () => {
    actions.clear();
    navigation.goBack();
  };

  // Display mapping for validation status (hook is display-agnostic per Q2 decision)
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
            if (presets.isDeleteMode) actions.exitDeleteMode();
          }}
        >
          {/* Total Bill Banner */}
          <Pressable
            style={styles.totalBillBanner}
            onPress={() => {
              if (presets.isDeleteMode) actions.exitDeleteMode();
            }}
          >
            <Text style={styles.totalBillLabel}>{t('screens.customSplit.totalBillLabel')}</Text>
            <Text style={styles.totalBillAmount}>
              {currencySymbol}
              {toFixedWithoutRounding(validation.overallTotal, 2)}
            </Text>
          </Pressable>

          {/* Saved Presets Section */}
          {presets.savedPresets.length > 0 && (
            <View style={styles.presetsSection}>
              <Pressable
                style={styles.presetsSectionHeader}
                onPress={() => {
                  if (presets.isDeleteMode) {
                    actions.exitDeleteMode();
                  } else {
                    actions.togglePresetsExpanded();
                  }
                }}
              >
                <Text style={styles.presetsSectionTitle}>
                  {t('screens.customSplit.savedPresets')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {presets.isDeleteMode && (
                    <Pressable onPress={actions.exitDeleteMode}>
                      <Text style={styles.doneButtonText}>
                        {t('common.done', { defaultValue: 'Done' })}
                      </Text>
                    </Pressable>
                  )}
                  <StyledIcons
                    type="MaterialDesignIcons"
                    name={presets.isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.accent}
                  />
                </View>
              </Pressable>
              {presets.isExpanded && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.presetsScrollContent}
                >
                  {presets.savedPresets.map(preset => (
                    <StyledCustomSplitPresetCard
                      key={preset.id}
                      preset={preset}
                      isActive={presets.activePresetId === preset.id}
                      isDeleteMode={presets.isDeleteMode}
                      onPress={() => actions.pressPreset(preset)}
                      onLongPress={actions.longPressPreset}
                      onDelete={actions.requestDeletePreset}
                      getPresetSummary={actions.getPresetSummary}
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
              if (presets.isDeleteMode) actions.exitDeleteMode();
            }}
            accessible={false}
          >
            {people.list.map((person: IndividualSplit, index: number) => (
              <StyledCustomSplitPersonCard
                key={person.id}
                person={person}
                index={index}
                totalPeople={people.list.length}
                currencySymbol={currencySymbol}
                onUpdate={actions.updatePerson}
                onRemove={actions.removePerson}
                t={t}
                theme={theme}
                styles={styles}
              />
            ))}

            {/* Add Person Button */}
            {people.canAdd && (
              <Pressable style={styles.addPersonButton} onPress={actions.addPerson}>
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
        <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 16 }]}>
          {/* Display clear button if custom split is currently active */}
          {isCustomSplitActive && (
            <Pressable style={styles.clearActiveSplitButton} onPress={handleClear}>
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
              style={[
                styles.saveButton,
                styles.applyButton,
                !validation.canSave && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!validation.canSave}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  !validation.canSave && styles.saveButtonTextDisabled,
                ]}
              >
                {t('screens.customSplit.applySplit')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.presetButton, !validation.canSave && styles.presetButtonDisabled]}
              onPress={() => {
                if (presets.activePresetId) {
                  actions.updatePreset();
                } else {
                  actions.openSaveModal();
                }
              }}
              disabled={!validation.canSave}
            >
              <Text
                style={[
                  styles.presetButtonText,
                  !validation.canSave && styles.presetButtonTextDisabled,
                ]}
              >
                {presets.activePresetId
                  ? t('screens.customSplit.updatePreset')
                  : t('screens.customSplit.saveAsPreset')}
              </Text>
            </Pressable>
          </View>

          {/* Save as New option when editing a preset */}
          {presets.activePresetId && validation.canSave && (
            <Pressable style={styles.saveAsNewButton} onPress={actions.openSaveModal}>
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
        visible={presets.isNameModalVisible}
        title={t('screens.customSplit.presetNameTitle')}
        type="info"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: actions.closeSaveModal,
          },
          {
            text: t('common.save'),
            onPress: actions.savePreset,
          },
        ]}
        onDismiss={actions.closeSaveModal}
      >
        <TextInput
          style={styles.presetNameInput}
          value={presets.nameInput}
          onChangeText={actions.setNameInput}
          placeholder={t('screens.customSplit.presetNamePlaceholder')}
          placeholderTextColor={theme.utils.hexToRGBA(theme.colors.card_typography, 0.4)}
          maxLength={30}
          autoFocus
        />
      </StyledAlert>

      {/* Duplicate Preset Alert */}
      <StyledAlert
        visible={presets.duplicateAlert !== null}
        title={
          presets.duplicateAlert?.type === 'name'
            ? t('screens.customSplit.duplicateNameTitle')
            : presets.duplicateAlert?.type === 'config'
            ? t('screens.customSplit.duplicateConfigTitle')
            : t('screens.customSplit.duplicateBothTitle')
        }
        message={
          presets.duplicateAlert?.type === 'name'
            ? t('screens.customSplit.duplicateNameMessage', {
                name: presets.duplicateAlert.preset.name,
              })
            : presets.duplicateAlert?.type === 'config'
            ? t('screens.customSplit.duplicateConfigMessage', {
                name: presets.duplicateAlert?.preset.name,
              })
            : t('screens.customSplit.duplicateBothMessage', {
                name: presets.duplicateAlert?.preset.name,
              })
        }
        type="warning"
        buttons={
          presets.duplicateAlert?.type === 'name'
            ? [
                {
                  text: t('common.ok'),
                  onPress: actions.confirmDuplicateAndRename,
                },
              ]
            : [
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                  onPress: actions.dismissDuplicateAlert,
                },
                {
                  text: t('screens.customSplit.loadPreset'),
                  onPress: () => {
                    if (presets.duplicateAlert) {
                      actions.loadPresetFromDuplicate(presets.duplicateAlert.preset);
                    }
                  },
                },
              ]
        }
        onDismiss={actions.dismissDuplicateAlert}
      />

      {/* Delete Preset Confirmation */}
      <StyledAlert
        visible={presets.isDeleteConfirmVisible}
        title={t('screens.customSplit.deletePresetTitle')}
        message={t('screens.customSplit.deletePresetConfirm')}
        type="confirm"
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: actions.cancelDeletePreset,
          },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: actions.confirmDeletePreset,
          },
        ]}
        onDismiss={actions.cancelDeletePreset}
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography }) => ({
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Bold,
    color: colors.white,
    opacity: 0.9,
  },
  totalBillAmount: {
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
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
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
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
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
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
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
    marginRight: 4,
  },
  valueInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
    padding: 0,
  },
  valueInputSuffix: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
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
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Bold,
  },
  breakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  breakdownText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
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
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
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
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
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
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
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
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card_typography,
    marginBottom: 2,
  },
  presetCardNameActive: {
    color: colors.white,
  },
  presetCardPeople: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontFamily: fonts.Nunito_Medium,
    color: colors.card_typography,
    opacity: 0.7,
  },
  presetCardPeopleActive: {
    color: colors.white,
    opacity: 0.9,
  },
  presetCardSummary: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
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
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
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
