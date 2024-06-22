import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { UnistylesRuntime } from 'react-native-unistyles';
// Custom Stacks
import DrawerStack from '@navigation/DrawerStack';
// Custom Hooks
import { getUserPreferredTheme } from '@hooks';

const ApplicationNavigator = (props: any) => {
  useEffect(() => {
    // Setting user preferred theme or initialTheme
    const setAppTheme = async () => {
      const preferredTheme = await getUserPreferredTheme();
      if (!UnistylesRuntime.hasAdaptiveThemes) {
        UnistylesRuntime.setTheme(preferredTheme);
      }
    };
    setAppTheme();
  }, []);

  const navigationRef = useNavigationContainerRef();
  useReduxDevToolsExtension(navigationRef);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <DrawerStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
