import React from 'react';
import { TextStyle, ViewStyle, TextProps } from 'react-native';
// Vector Icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

// Object containing all icon types for easy reference
export const StyledIconTypes = {
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Entypo,
  Octicons,
};

// Type representing keys of StyledIconTypes
export type StyledIconTypesKeys = keyof typeof StyledIconTypes;

// `TextProps` ensures that all Text component properties are also accepted
interface StyledIconsProps extends TextProps {
  type: StyledIconTypesKeys;
  name: string;
  color?: string;
  size?: number;
  style?: TextStyle | ViewStyle;
}

// StyledIcons functional component
export const StyledIcons: React.FC<StyledIconsProps> = ({
  type,
  name,
  color,
  size,
  style,
  ...rest // Collect the remaining props
}) => {
  // Get the appropriate icon component from StyledIconTypes
  const IconComponent = StyledIconTypes[type];

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
      {...rest} // Pass remaining props to the icon component
    />
  );
};
