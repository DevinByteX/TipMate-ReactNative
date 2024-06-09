import { createDrawerNavigator } from '@react-navigation/drawer';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';
import { StyledDrawer } from '@/components';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <StyledDrawer {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeTipScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
