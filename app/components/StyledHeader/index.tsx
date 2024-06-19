import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
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

type HeaderIconProps = {
  iconType: StyledIconTypesKeys;
  iconName: string;
  iconSize: number;
  iconColor?: string;
  onPress?: () => void;
};

// Define a general type for the drawer navigation prop
type DrawerNavProp = DrawerNavigationProp<Record<string, object | undefined>>;

const HeaderIcon = ({ iconType, iconName, iconSize, iconColor, onPress }: HeaderIconProps) => {
  return (
    <Pressable onPress={onPress}>
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
        barStyle={'default'}
      />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerInnerContainer}>
          <View style={styles.innerLeftContainer}>
            <HeaderIcon
              iconType={'FontAwesome'}
              iconName={'navicon'}
              iconSize={styles.headerText.fontSize}
              iconColor={styles.headerText.color}
              onPress={() => {
                navigation.toggleDrawer();
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
              <HeaderIcon
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
    paddingStart: (UnistylesRuntime.screen.width * 5) / 100,
  },
  innerMiddleContainer: { flex: 2, justifyContent: 'center', alignItems: 'center' },
  innerRightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
