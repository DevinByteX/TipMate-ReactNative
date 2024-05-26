import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
// Vector Icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Foundation from 'react-native-vector-icons/Foundation';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export const IconTypes = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
};

type IconTypesKeys = keyof typeof IconTypes;

interface StyledIconsProps {
  type: IconTypesKeys;
  name: string;
  color: string;
  size?: number;
  style?: TextStyle | ViewStyle;
}

export const StyledIcons: React.FC<StyledIconsProps> = ({
  type,
  name,
  color,
  size = 24,
  style,
}) => {
  const IconComponent = IconTypes[type];
  return (
    <>{type && name && <IconComponent name={name} size={size} color={color} style={style} />}</>
  );
};
