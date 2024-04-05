import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export const CustomText = () => {
  return (
    <View>
      <Text style={styles.textStyles}>CustomText</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyles: {
    color: 'green',
  },
});
