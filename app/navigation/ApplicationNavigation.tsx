import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';

const Drawer = createDrawerNavigator();

const ApplicationNavigator = (props: any) => {
  const navigationRef = useNavigationContainerRef();
  useReduxDevToolsExtension(navigationRef);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="Home" component={HomeTipScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
