import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {CustomText} from '@/components';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import '@styles/uniStyles';

const Entrypoint = () => {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Pressable
        style={styles.button}
        onPress={() =>
          UnistylesRuntime.setTheme(
            UnistylesRuntime.themeName === 'light' ? 'dark' : 'light',
          )
        }>
        <Text>Switch theme</Text>
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundColor,
  },
  button: {
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
  },
}));

export default Entrypoint;
