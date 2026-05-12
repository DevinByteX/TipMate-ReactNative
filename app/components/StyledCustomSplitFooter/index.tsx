import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyledIcons } from '@components';
import { IndividualSplit } from '@/context/types';

interface ValidationStatus {
  status: 'complete' | 'under' | 'over';
  totalAllocatedPercentage: number;
  fixedTotal: number;
  percentageTotal: number;
  remainderCount: number;
  remainingPercentage: number;
}

interface StyledCustomSplitFooterProps {
  validation: ValidationStatus;
  canSave: boolean;
  isCustomSplitActive: boolean;
  activePresetId: string | null;
  onSave: () => void;
  onClearCustomSplit: () => void;
  onSaveAsNew: () => void;
  onUpdatePreset: () => void;
  people: IndividualSplit[];
  getValidationIcon: () => { name: any; color: string };
  getValidationText: () => string;
  t: (key: string, options?: any) => string;
  theme: any;
  styles: any;
}

const StyledCustomSplitFooter = ({
  validation,
  canSave,
  isCustomSplitActive,
  activePresetId,
  onSave,
  onClearCustomSplit,
  onSaveAsNew,
  onUpdatePreset,
  people,
  getValidationIcon,
  getValidationText,
  t,
  theme,
  styles,
}: StyledCustomSplitFooterProps) => {
  const validationIcon = getValidationIcon();

  return (
    <View style={styles.footerContainer}>
      {/* Display clear button if custom split is currently active */}
      {isCustomSplitActive && (
        <Pressable style={styles.clearActiveSplitButton} onPress={onClearCustomSplit}>
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
          name={validationIcon.name}
          size={18}
          color={validationIcon.color}
        />
        <Text style={[styles.validationText, { color: validationIcon.color }]}>
          {getValidationText()}
        </Text>
      </View>

      {/* Breakdown Row */}
      {validation.status === 'complete' && (
        <View style={styles.breakdownRow}>
          {validation.fixedTotal > 0 && (
            <Text style={styles.breakdownText}>
              {validation.fixedTotal.toFixed(2)} {t('screens.customSplit.fixed').toLowerCase()}
            </Text>
          )}
          {validation.percentageTotal > 0 && (
            <Text style={styles.breakdownText}>
              {validation.percentageTotal.toFixed(1)}% {t('screens.customSplit.allocated')}
            </Text>
          )}
          {validation.remainderCount > 0 && (
            <Text style={styles.breakdownText}>
              {validation.remainderCount} {t('screens.customSplit.remainder').toLowerCase()}
            </Text>
          )}
        </View>
      )}

      {/* Save Button */}
      <Pressable
        style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={!canSave}
      >
        <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
          {t('screens.customSplit.saveButton')}
        </Text>
      </Pressable>

      {/* Footer Button Row */}
      <View style={styles.footerButtonRow}>
        <Pressable
          style={[styles.presetButton, !canSave && styles.presetButtonDisabled]}
          onPress={activePresetId ? onUpdatePreset : onSaveAsNew}
          disabled={!canSave}
        >
          <Text style={[styles.presetButtonText, !canSave && styles.presetButtonTextDisabled]}>
            {activePresetId
              ? t('screens.customSplit.updatePreset')
              : t('screens.customSplit.saveAsNewPreset')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(StyledCustomSplitFooter);
