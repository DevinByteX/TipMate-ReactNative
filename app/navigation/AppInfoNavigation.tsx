import AboutUsScreen from '@/screens/AppInfoScreens/AboutUsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AppInfoNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, orientation: 'portrait' }}>
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
    </Stack.Navigator>
  );
};

export default AppInfoNavigation;
