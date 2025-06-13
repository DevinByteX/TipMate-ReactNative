import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from '@navigation/DrawerNavigation';
import LicensesScreen from '@/screens/AppInfoScreens/LicenseScreen';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, orientation: 'portrait' }}>
      <Stack.Screen name="MainStack" component={DrawerNavigation} />
      <Stack.Screen name="LicensesScreen" component={LicensesScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
