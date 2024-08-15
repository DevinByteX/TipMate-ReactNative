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
          description={
            'Personalise Your Tips: Adjust your default tip by typing in the fields. It’s quick and easy!'
          }
        />
        <StyledSplitOptionsEditMode
          title={'CUSTOMISE YOUR SPLITS'}
          description={
            'Set Your Splits: Enter your split preferences in the fields to customise how the bill is divided'
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
