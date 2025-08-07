import React from 'react';
import { ScrollView } from 'react-native';
// Custom Component
import { StyledHeader } from '@components';
// Styling
import { StyleSheet } from 'react-native-unistyles';

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

const styles = StyleSheet.create(({ colors }, runtime) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (runtime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: (runtime.screen.height * 8) / 100,
  },
}));

export default SavedTipsScreen;
