import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons, StyledIconTypesKeys, StyledToggle } from '@components';
import { setUserPreferredTheme } from '@hooks';

interface StyledDrawerProps extends DrawerContentComponentProps {}

type BottomButtonProps = {
  iconType: StyledIconTypesKeys;
  iconName: string;
  iconSize: number;
  iconColor?: string;
  label: string;
  onPress?: () => void;
};

const BottomButton = ({
  iconType,
  iconName,
  iconSize,
  iconColor,
  label,
  onPress,
}: BottomButtonProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity onPress={onPress} style={styles.bottomButtonStyles} activeOpacity={0.6}>
      <StyledIcons type={iconType} name={iconName} size={iconSize} color={iconColor} />
      <Text style={styles.footerButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export const StyledDrawer: React.FC<StyledDrawerProps> = props => {
  const { styles } = useStyles(stylesheet);

  const persistUserPreferredTheme = async (value: boolean) => {
    await setUserPreferredTheme(value ? 'dark' : 'light');
  };

  return (
    <View style={styles.mainDrawerContainer}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerButtonContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.horizontalDeviderStyles} />
      <View style={styles.preferencesButtonContainer}>
        <Text style={styles.preferencesText}>Preferences</Text>
        <View style={styles.themePrefContainer}>
          <Text style={styles.themePrefText}>Toggle Dark Mode</Text>
          <StyledToggle
            value={UnistylesRuntime.themeName === 'dark'}
            onValueChange={value => {
              persistUserPreferredTheme(value);
              UnistylesRuntime.setTheme(value ? 'dark' : 'light');
            }}
          />
        </View>
      </View>
      <View style={styles.horizontalDeviderStyles} />
      <View style={styles.bottomButtonContainer}>
        <BottomButton
          iconType={'AntDesign'}
          iconName={'sharealt'}
          iconColor={styles.footerButtonText.color}
          iconSize={styles.footerButtonText.fontSize + 4}
          label={'Tell a Friend'}
        />
        <BottomButton
          iconType={'MaterialIcons'}
          iconName={'feedback'}
          iconColor={styles.footerButtonText.color}
          iconSize={styles.footerButtonText.fontSize + 4}
          label={'About Us'}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainDrawerContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  drawerButtonContainer: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
  },
  horizontalDeviderStyles: {
    backgroundColor: colors.devider,
    width: '100%',
    height: UnistylesRuntime.hairlineWidth * 8,
  },
  bottomButtonContainer: {
    paddingStart: (UnistylesRuntime.screen.width * 4) / 100,
    paddingBottom: UnistylesRuntime.insets.bottom,
  },
  bottomButtonStyles: {
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    paddingStart: (UnistylesRuntime.screen.width * 2) / 100,
  },
  preferencesButtonContainer: {
    paddingStart: (UnistylesRuntime.screen.width * 4) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  preferencesText: {
    color: colors.card_typography,
    fontSize: 16,
    fontFamily: fonts.Nunito_Black,
  },
  themePrefContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  themePrefText: {
    color: colors.card_typography,
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    paddingEnd: (UnistylesRuntime.screen.width * 2) / 100,
  },
}));

export default StyledDrawer;
