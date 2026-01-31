import React from 'react';
import { Keyboard, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { IconTypeMap, StyledIconTypesKey, StyledIcons } from '@components';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type styledHeaderProps = {
  headerTitle: string;
  headerSubTitle?: string;
  headerSubTitleVisibility?: boolean;
  headerRightIconVisibilty?: boolean;
  headerRightIconType?: StyledIconTypesKey;
  headerRightIconName?: string;
  headerRightIconColor?: string;
  onHeaderRightIconPress?: () => void;
  enableBackButton?: boolean;
};

type HeaderBarIconProps = {
  iconType: StyledIconTypesKey;
  iconName: React.ComponentProps<IconTypeMap[StyledIconTypesKey]>['name'];
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
  headerRightIconType = 'Ionicons',
  headerRightIconName = 'save',
  headerRightIconColor,
  onHeaderRightIconPress,
  enableBackButton = false,
}: styledHeaderProps) => {
  const { theme, rt } = useUnistyles();

  // Use the useNavigation hook with the general drawer navigation type
  const navigation = useNavigation<DrawerNavProp>();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.headerBGColor}
        translucent={true}
        barStyle={rt.themeName === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerInnerContainer}>
          <View style={styles.innerLeftContainer}>
            <HeaderBarIcon
              iconType={'FontAwesome6'}
              iconName={enableBackButton ? 'chevron-left' : 'bars'}
              iconSize={styles.headerText.fontSize}
              iconColor={styles.headerText.color}
              headerBarStyles={styles.headerLeftButtonStyles}
              onPress={() => {
                enableBackButton ? navigation.goBack() : navigation.toggleDrawer();
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
              ]}
            >{`${headerTitle}`}</Text>
            {headerSubTitleVisibility && (
              <Text style={styles.headerSubText}>{`${headerSubTitle}`}</Text>
            )}
          </View>
          <View style={styles.innerRightContainer}>
            {headerRightIconVisibilty && (
              <HeaderBarIcon
                iconType={headerRightIconType}
                iconName={headerRightIconName as any}
                iconSize={styles.headerText.fontSize}
                iconColor={headerRightIconColor || styles.headerText.color}
                headerBarStyles={styles.headerRightButtonStyles}
                onPress={onHeaderRightIconPress}
              />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create(({ colors, fonts }, rt) => ({
  headerMainContainer: {
    backgroundColor: colors.headerBGColor,
    paddingTop: rt.statusBar.height,
    paddingBottom: (rt.screen.height * 0.5) / 100,
  },
  headerInnerContainer: {
    flexDirection: 'row',
    height: (rt.screen.height * 6) / 100,
  },
  innerLeftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerLeftButtonStyles: {
    paddingStart: (rt.screen.width * 5) / 100,
  },
  innerMiddleContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  innerRightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerRightButtonStyles: {
    paddingEnd: (rt.screen.width * 5) / 100,
  },
  headerText: {
    fontSize: 20,
    color: colors.accent,
    fontFamily: fonts.Nunito_Black,
  },
  headerSubText: {
    fontSize: 8,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
  },
}));
