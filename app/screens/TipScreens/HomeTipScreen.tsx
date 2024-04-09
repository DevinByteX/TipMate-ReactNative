import React from 'react';
import {View, Text} from 'react-native';
// custom component
import {StyledHeader} from '@/components';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const HomeTipScreen = () => {
  const {styles} = useStyles(stylesheet);
  return (
    <>
      <StyledHeader />
      <View style={styles.mainContainer}></View>
    </>
  );
};

const stylesheet = createStyleSheet(({colors}) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
}));

export default HomeTipScreen;
