import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const StyledTipOptions = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <Text>StyledTipOptions</Text>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {},
}));
