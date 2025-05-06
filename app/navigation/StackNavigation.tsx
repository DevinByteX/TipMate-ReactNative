import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from '@navigation/DrawerNavigation';
import AppInfoNavigation from './AppInfoNavigation';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, orientation: 'portrait' }}>
      <Stack.Screen name="MainStack" component={DrawerNavigation} />
      <Stack.Screen name="AppInfoStack" component={AppInfoNavigation} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
