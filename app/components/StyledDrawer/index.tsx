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
import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/native';

interface StyledDrawerProps extends DrawerContentComponentProps {}

type BottomButtonProps = {
  iconType: StyledIconTypesKeys;
  iconName: string;
  iconSize: number;
  iconColor?: string;
  label: string;
  onPress?: () => void;
  isFocused?: boolean;
};

const getActiveRouteName = (route: Route<string> | undefined): string | undefined => {
  if (!route) return undefined;

  const focusedRouteName = getFocusedRouteNameFromRoute(route);

  return focusedRouteName ?? route.name;
};

const BottomButton = ({
  iconType,
  iconName,
  iconSize,
  iconColor,
  label,
  onPress,
  isFocused,
}: BottomButtonProps) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.bottomButtonStyles,
        {
          backgroundColor: isFocused
            ? theme.utils.hexToRGBA(theme.colors.card_typography, 0.1)
            : 'transparent',
        },
      ]}
      activeOpacity={0.5}>
      <StyledIcons
        type={iconType}
        name={iconName}
        size={iconSize}
        color={isFocused ? theme.colors.card_typography : iconColor}
      />
      <Text
        style={[
          styles.footerButtonText,
          { color: isFocused ? theme.colors.card_typography : iconColor },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const StyledDrawer: React.FC<StyledDrawerProps> = props => {
  const { styles } = useStyles(stylesheet);

  const activeRouteName = getActiveRouteName(props.state.routes[props.state.index]);
  console.log('Active Route Name:', activeRouteName);

  const persistUserPreferredTheme = async (value: boolean) => {
    await setUserPreferredTheme(value ? 'dark' : 'light');
  };

  const NaviagteToAboutUsScreen = () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('AboutUsScreen');
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
          iconType={'FontAwesome'}
          iconName={'share-alt-square'}
          iconColor={styles.footerButtonText.color}
          iconSize={styles.footerButtonText.fontSize + 4}
          isFocused={activeRouteName === 'TellAFriendScreen'}
          label={'Tell a Friend'}
        />
        <BottomButton
          iconType={'Entypo'}
          iconName={'info-with-circle'}
          iconColor={styles.footerButtonText.color}
          iconSize={styles.footerButtonText.fontSize + 4}
          label={'About Us'}
          isFocused={activeRouteName === 'AboutUsScreen'}
          onPress={NaviagteToAboutUsScreen}
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 4) / 100,
    paddingTop: UnistylesRuntime.insets.bottom / 2,
    paddingBottom: UnistylesRuntime.insets.bottom,
  },
  bottomButtonStyles: {
    paddingVertical: (UnistylesRuntime.screen.height * 1.75) / 100,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    paddingStart: 16, // as per the react navigation drawer item paddingStart in the source code
    borderRadius: 56, // as per the react navigation drawer item borderRadius in the source code
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
