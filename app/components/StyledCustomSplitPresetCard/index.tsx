import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { StyledIcons } from '@components';
import { SavedSplitPreset } from '@/context/types';

interface ShakingPresetCardProps {
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
}

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
}: ShakingPresetCardProps) => {
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

export default React.memo(ShakingPresetCard);
