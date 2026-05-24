import React, { useCallback } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { StyledIcons } from '@components';
import { IndividualSplit } from '@/context/types';
import { Constants } from '@/configs';

// Allocation type button component
const AllocationTypeButton = ({
  label,
  isActive,
  onPress,
  theme: _theme,
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

interface PersonCardProps {
  person: IndividualSplit;
  index: number;
  totalPeople: number;
  currencySymbol: string;
  onUpdate: (id: string, updates: Partial<IndividualSplit>) => void;
  onRemove: (id: string) => void;
  t: (key: string, options?: any) => string;
  theme: any;
  styles: any;
}

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
}: PersonCardProps) => {
  const canRemove = totalPeople > Constants.MIN_SPLIT_PEOPLE;
  const placeholderName = `${t('screens.customSplit.personDefault', { number: index + 1 })} - ${t(
    'screens.customSplit.namePlaceholder',
  )}`;

  const handleAllocationTypeChange = useCallback(
    (type: IndividualSplit['allocationType']) => {
      onUpdate(person.id, {
        allocationType: type,
        value: undefined,
        calculatedAmount: undefined,
      });
    },
    [person.id, onUpdate],
  );

  const handleValueChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/[^0-9.]/g, '');
      // Prevent multiple decimal points
      const parts = cleaned.split('.');
      const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
      const numValue = parseFloat(sanitized);
      onUpdate(person.id, { value: isNaN(numValue) ? undefined : numValue });
    },
    [person.id, onUpdate],
  );

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

export default React.memo(PersonCard);
