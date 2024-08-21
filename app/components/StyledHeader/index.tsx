import React from 'react';
import { Keyboard, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIconTypesKeys, StyledIcons } from '@components';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type styledHeaderProps = {
  headerTitle: string;
  headerSubTitle?: string;
  headerSubTitleVisibility?: boolean;
  headerRightIconVisibilty?: boolean;
};

type HeaderBarIconProps = {
  iconType: StyledIconTypesKeys;
  iconName: string;
  iconSize: number;
  iconColor?: string;
  onPress?: () => void;
  headerBarStyles?: ViewStyle;
};

// Define a general type for the drawer navigation prop
type DrawerNavProp = DrawerNavigationProp<Record<string, object | undefined>>;

const HeaderBarIcon = ({
  iconType,
  iconName,
  iconSize,
  iconColor,
  headerBarStyles,
  onPress,
}: HeaderBarIconProps) => {
  return (
    <Pressable style={headerBarStyles} onPress={onPress}>
      <StyledIcons type={iconType} name={iconName} size={iconSize} color={iconColor} />
    </Pressable>
  );
};

export const StyledHeader = ({
  headerTitle = 'TipMate',
  headerSubTitle = 'Smart Tips, Easy Living',
  headerSubTitleVisibility = true,
  headerRightIconVisibilty = true,
}: styledHeaderProps) => {
  const { styles, theme } = useStyles(stylesheet);

  // Use the useNavigation hook with the general drawer navigation type
  const navigation = useNavigation<DrawerNavProp>();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.headerBGColor}
        translucent={true}
        barStyle={UnistylesRuntime.themeName === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerInnerContainer}>
          <View style={styles.innerLeftContainer}>
            <HeaderBarIcon
              iconType={'FontAwesome'}
              iconName={'navicon'}
              iconSize={styles.headerText.fontSize}
              iconColor={styles.headerText.color}
              headerBarStyles={styles.headerLeftButtonStyles}
              onPress={() => {
                navigation.toggleDrawer();
                Keyboard.dismiss();
              }}
            />
          </View>
          <View style={styles.innerMiddleContainer}>
            <Text
              style={[
                styles.headerText,
                {
                  color: headerSubTitleVisibility
                    ? theme.colors.accent
                    : theme.colors.card_typography,
                },
              ]}>{`${headerTitle}`}</Text>
            {headerSubTitleVisibility && (
              <Text style={styles.headerSubText}>{`${headerSubTitle}`}</Text>
            )}
          </View>
          <View style={styles.innerRightContainer}>
            {headerRightIconVisibilty && (
              <HeaderBarIcon
                iconType={'Ionicons'}
                iconName={'save'}
                iconSize={styles.headerText.fontSize}
                iconColor={styles.headerText.color}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  headerMainContainer: {
    backgroundColor: colors.headerBGColor,
    paddingTop: UnistylesRuntime.statusBar.height,
    paddingBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  headerInnerContainer: {
    flexDirection: 'row',
    height: (UnistylesRuntime.screen.height * 6) / 100,
  },
  innerLeftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerLeftButtonStyles: {
    paddingStart: (UnistylesRuntime.screen.width * 5) / 100,
  },
  innerMiddleContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  innerRightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerRightButtonStyles: {
    paddingEnd: (UnistylesRuntime.screen.width * 5) / 100,
  },
  headerText: {
    fontSize: 22,
    color: colors.accent,
    fontFamily: fonts.Nunito_Black,
  },
  headerSubText: {
    fontSize: 8,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
  },
}));
