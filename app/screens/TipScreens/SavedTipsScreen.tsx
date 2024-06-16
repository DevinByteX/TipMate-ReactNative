import React from 'react';
import { View, Text } from 'react-native';
// Components
import { StyledHeader } from '@components';

const SavedTipsScreen = () => {
  return (
    <>
      <StyledHeader
        headerTitle={'TipMate'}
        headerSubTitle={'History & Summary'}
        headerRightIconVisibilty={false}
      />
    </>
  );
};

export default SavedTipsScreen;
