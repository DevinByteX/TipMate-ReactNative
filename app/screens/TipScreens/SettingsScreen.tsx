import React from 'react';
import { ScrollView } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledHeader, StyledSplitOptionsEditMode, StyledTipOptionsEditMode } from '@components';

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
        <StyledTipOptionsEditMode
          title={'CUSTOMISE YOUR TIPS'}
          description={'To customise the options, simply begin typing in the tip option UI fields.'}
        />
        <StyledSplitOptionsEditMode
          title={'CUSTOMISE YOUR SPLITS'}
          description={
            'To customise the options, simply begin typing in the split option UI fields.'
          }
        />
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
