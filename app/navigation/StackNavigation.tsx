import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from '@navigation/DrawerNavigation';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainStack"
        component={DrawerNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
