import React from 'react';
import { ScrollView } from 'react-native';
// Custom Component
import { StyledHeader } from '@components';
// Styling
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

const SavedTipsScreen = () => {
  return (
    <>
      <StyledHeader
        headerTitle={'TipMate'}
        headerSubTitle={'History & Summary'}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      ></ScrollView>
    </>
  );
};

const styles = StyleSheet.create(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (UnistylesRuntime.screen.height * 8) / 100,
  },
}));

export default SavedTipsScreen;
