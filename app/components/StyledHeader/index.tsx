import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledIcons } from '../StyledIcons';

type styledHeaderProps = {
  headerTitle: string;
  headerSubTitle: string;
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
            <StyledIcons type={'FontAwesome'} name={'navicon'} size={styles.headerText.fontSize} />
          </View>
          <View style={styles.innerMiddleContainer}>
            <Text style={styles.headerText}>{`${headerTitle}`}</Text>
            <Text style={styles.headerSubText}>{`${headerSubTitle}`}</Text>
          </View>
          <View style={styles.innerRightContainer}>
            <StyledIcons type={'Ionicons'} name={'save'} size={styles.headerText.fontSize} />
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
