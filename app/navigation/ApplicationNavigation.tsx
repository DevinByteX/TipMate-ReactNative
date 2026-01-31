import React, { useEffect } from 'react';
// Third party libs
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';
import Toast from 'react-native-toast-message';
import BootSplash from 'react-native-bootsplash';
// Custom Stacks
import StackNavigation from '@navigation/StackNavigation';
// Custom Hooks
import { getUserPreferredTheme, getUserUpdatedThemeOption, useThemeColorCustomiser } from '@hooks';
import { toastConfig } from '@styles/toastConfig';

const ApplicationNavigator = (props: any) => {
  const { rt } = useUnistyles();

  useEffect(() => {
    // Setting user preferred theme or initialTheme
    const setAppTheme = async () => {
      try {
        const preferredTheme = await getUserPreferredTheme();
        const updatedThemeOption = await getUserUpdatedThemeOption();

        // Ensure updatedThemeOption is an array
        useThemeColorCustomiser(updatedThemeOption);

        console.log('Setting app theme to:', preferredTheme);
        UnistylesRuntime.setTheme(preferredTheme);
        // explicitly set adaptiveThemes to false to prevent system theme changes
        UnistylesRuntime.setAdaptiveThemes(false);
      } catch (error) {
        console.log('Error setting app theme:', error);
      }
    };
    setAppTheme();
  }, []);

  const navigationRef = useNavigationContainerRef();
  useReduxDevToolsExtension(
    navigationRef as React.RefObject<
      import('@react-navigation/native').NavigationContainerRef<any>
    >,
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          BootSplash.hide({ fade: true });
        }}
      >
        <StackNavigation />
      </NavigationContainer>
      <Toast config={toastConfig} topOffset={rt.insets.top} />
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
