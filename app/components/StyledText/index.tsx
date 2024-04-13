import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export const StyledText = () => {
  return (
    <View>
      <Text style={styles.textStyles}>StyledText</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyles: {
    color: 'green',
  },
});
