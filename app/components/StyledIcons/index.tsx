import React from 'react';
import { TextStyle, ViewStyle, TextProps } from 'react-native';
// Vector Icons
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Feather } from '@react-native-vector-icons/feather';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Foundation } from '@react-native-vector-icons/foundation';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Lucide } from '@react-native-vector-icons/lucide';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Octicons } from '@react-native-vector-icons/octicons';

// Object containing all icon types for easy reference
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

type IconTypeMap = {
  AntDesign: typeof AntDesign;
  Feather: typeof Feather;
  FontAwesome6: typeof FontAwesome6;
  Foundation: typeof Foundation;
  Ionicons: typeof Ionicons;
  Lucide: typeof Lucide;
  MaterialDesignIcons: typeof MaterialDesignIcons;
  Octicons: typeof Octicons;
};

// Type representing keys of StyledIconTypes
export type StyledIconTypesKey = keyof typeof StyledIconTypes;

interface StyledIconsProps<T extends StyledIconTypesKey> extends TextProps {
  type: StyledIconTypesKey;
  name: React.ComponentProps<IconTypeMap[T]>['name'];
  color?: string;
  size?: number;
  iconStyleType?: 'solid' | 'regular' | 'brand'; // Added iconStyleType prop
}

// StyledIcons functional component
export const StyledIcons = <T extends StyledIconTypesKey>({
  type,
  name,
  color,
  size,
  iconStyleType = type == 'FontAwesome6' ? 'solid' : undefined, // Default to 'solid' for FontAwesome6
  ...rest // Collect the remaining props
}: StyledIconsProps<T>) => {
  const IconComponent = StyledIconTypes[type] as any; // Type assertion to resolve the type error

  return (
    <IconComponent name={name} size={size} color={color} iconStyle={iconStyleType} {...rest} />
  );
};
