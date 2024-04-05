import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {CustomText} from '@/components';

const Entrypoint = () => {
  return (
    <View style={styles.mainContainer}>
      <CustomText />
    </View>
  );
};

export default Entrypoint;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
