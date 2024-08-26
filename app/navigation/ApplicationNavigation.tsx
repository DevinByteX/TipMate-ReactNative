import React, { useEffect } from 'react';
// Third party libs
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { UnistylesRuntime } from 'react-native-unistyles';
import Toast from 'react-native-toast-message';
// Custom Stacks
import StackNavigation from '@navigation/StackNavigation';
// Custom Hooks
import { getUserPreferredTheme, getUserUpdatedThemeOption, useThemeColorCustomiser } from '@hooks';
import { toastConfig } from '@styles/toastConfig';

const ApplicationNavigator = (props: any) => {
  useEffect(() => {
    // Setting user preferred theme or initialTheme
    const setAppTheme = async () => {
      try {
        const preferredTheme = await getUserPreferredTheme();
        const updatedThemeOption = await getUserUpdatedThemeOption();

        // Ensure updatedThemeOption is an array
        useThemeColorCustomiser(updatedThemeOption);

        if (!UnistylesRuntime.hasAdaptiveThemes) {
          UnistylesRuntime.setTheme(preferredTheme);
        }
      } catch (error) {
        console.log('Error setting app theme:', error);
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
        <StackNavigation />
      </NavigationContainer>
      <Toast config={toastConfig} topOffset={UnistylesRuntime.insets.top} />
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
