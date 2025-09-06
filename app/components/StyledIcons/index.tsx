import React from 'react';
import { TextProps } from 'react-native';

// Vector Icons
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Feather } from '@react-native-vector-icons/feather';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Foundation } from '@react-native-vector-icons/foundation';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Lucide } from '@react-native-vector-icons/lucide';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Octicons } from '@react-native-vector-icons/octicons';

/**
 * All supported icon families
 */
export const StyledIconTypes = {
  AntDesign,
  Feather,
  FontAwesome6,
  Foundation,
  Ionicons,
  Lucide,
  MaterialDesignIcons,
  Octicons,
} as const;

/**
 * Mapping of icon family name to component
 */
export type IconTypeMap = typeof StyledIconTypes;

/**
 * Keys of available icon families
 */
export type StyledIconTypesKey = keyof IconTypeMap;

/**
 * Base props for all icons
 */
export interface BaseIconProps<T extends StyledIconTypesKey> extends TextProps {
  type: T;
  name: React.ComponentProps<IconTypeMap[T]>['name'];
  color?: string;
  size?: number;
}

/**
 * Props for StyledIcons component
 */
export type StyledIconsProps<T extends StyledIconTypesKey> = BaseIconProps<T> & {
  /**
   * FontAwesome6-only style
   * Default is "solid"
   */
  iconStyleType?: 'solid' | 'regular' | 'brand';
};

/**
 * Generic, type-safe icon component
 */
export function StyledIcons<T extends StyledIconTypesKey>({
  type,
  name,
  color,
  size,
  iconStyleType,
  ...rest
}: StyledIconsProps<T>) {
  const IconComponent = StyledIconTypes[type] as any;

  // Only include iconStyle for FontAwesome6
  const faProps = type === 'FontAwesome6' ? { iconStyle: iconStyleType ?? 'solid' } : {};

  return <IconComponent name={name} size={size} color={color} {...faProps} {...rest} />;
}
