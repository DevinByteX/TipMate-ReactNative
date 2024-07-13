import React from 'react';
import { ScrollView } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledHeader, StyledTipOptions } from '@components';

const SettingsScreen = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <StyledHeader
        headerTitle={'TipMate'}
        headerSubTitle={'Settings & Preferences'}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <StyledTipOptions titleText="CUSTOMISE YOUR TIPS" editMode={true} />
      </ScrollView>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (UnistylesRuntime.screen.height * 8) / 100,
  },
}));

export default SettingsScreen;
