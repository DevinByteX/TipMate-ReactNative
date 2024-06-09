import { createDrawerNavigator } from '@react-navigation/drawer';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeTipScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
