import React from 'react';
import {StatusBar, Text, View} from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

type styledHeaderProps = {};

export const StyledHeader = ({}: styledHeaderProps) => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        backgroundColor={theme.colors.headerBGColor}
        translucent={true}
        barStyle={
          UnistylesRuntime.colorScheme === 'dark'
            ? 'light-content'
            : 'dark-content'
        }
      />
      <View style={styles.headerMainContainer}>
        <View style={styles.headerInnerContainer}></View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({colors}) => ({
  mainContainer: {
    backgroundColor: colors.headerBGColor,
    zIndex: 999,
  },
  headerMainContainer: {
    marginTop: UnistylesRuntime.statusBar.height,
    height: UnistylesRuntime.statusBar.height,
    backgroundColor: colors.headerBGColor,
  },
  headerInnerContainer: {},
}));
