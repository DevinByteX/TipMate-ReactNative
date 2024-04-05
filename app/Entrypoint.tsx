import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Entrypoint = () => {
  return <View style={styles.mainContainer}></View>;
};

export default Entrypoint;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
