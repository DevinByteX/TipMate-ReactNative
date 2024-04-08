import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import '@styles/uniStyles';
import {lightTheme} from '@styles/themes';
import {CustomText} from '@components';
import {NavigationContainer} from '@react-navigation/native';

const Entrypoint = () => {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <NavigationContainer>
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
        <Text style={{color: theme.colors.typography}}>
          {JSON.stringify(lightTheme)}
        </Text>
        <CustomText />
      </View>
    </NavigationContainer>
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
