import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from '@navigation/DrawerNavigation';
import LicensesScreen from '@/screens/AppInfoScreens/LicenseScreen';
import LicenseContentModalScreen from '@/screens/AppInfoScreens/LicenseContentModalScreen';
import SavedTipDetailScreen from '@/screens/TipScreens/SavedTipDetailScreen';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        orientation: 'portrait',
        animation: 'ios_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen name="MainStack" component={DrawerNavigation} />
      <Stack.Screen name="SavedTipDetailScreen" component={SavedTipDetailScreen} />
      <Stack.Screen name="LicensesScreen" component={LicensesScreen} />
      <Stack.Screen
        name="LicenseContentModal"
        component={LicenseContentModalScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
