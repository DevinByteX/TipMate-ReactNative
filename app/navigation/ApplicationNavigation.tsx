import React, { useEffect } from 'react';
// Third party libs
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { UnistylesRuntime } from 'react-native-unistyles';
import Toast from 'react-native-toast-message';
// Custom Stacks
import DrawerStack from '@navigation/DrawerStack';
// Custom Hooks
import { getUserPreferredTheme } from '@hooks';
import { toastConfig } from '@styles/toastConfig';

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
    return () => {};
  }, []);

  const navigationRef = useNavigationContainerRef();
  useReduxDevToolsExtension(navigationRef);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <DrawerStack />
      </NavigationContainer>
      <Toast config={toastConfig} topOffset={UnistylesRuntime.insets.top} />
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
