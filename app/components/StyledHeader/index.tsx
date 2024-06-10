import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIconTypesKeys, StyledIcons } from '@components';

type styledHeaderProps = {
  headerTitle: string;
  headerSubTitle: string;
};

type HeaderIconProps = {
  iconType: StyledIconTypesKeys;
  iconName: string;
  iconSize: number;
  iconColor?: string;
  onPress?: () => void;
};

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
}: styledHeaderProps) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.headerBGColor}
        translucent={true}
        barStyle={UnistylesRuntime.colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerInnerContainer}>
          <View style={styles.innerLeftContainer}>
            <HeaderIcon
              iconType={'FontAwesome'}
              iconName={'navicon'}
              iconSize={styles.headerText.fontSize}
              iconColor={styles.headerSubText.color}
            />
          </View>
          <View style={styles.innerMiddleContainer}>
            <Text style={styles.headerText}>{`${headerTitle}`}</Text>
            <Text style={styles.headerSubText}>{`${headerSubTitle}`}</Text>
          </View>
          <View style={styles.innerRightContainer}>
            <HeaderIcon
              iconType={'Ionicons'}
              iconName={'save'}
              iconSize={styles.headerText.fontSize}
              iconColor={styles.headerSubText.color}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
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
    fontWeight: '800',
    color: colors.accent,
    borderColor: colors.card_typography,
  },
  headerSubText: {
    fontSize: 8,
    fontWeight: '400',
    color: colors.card_typography,
  },
}));
