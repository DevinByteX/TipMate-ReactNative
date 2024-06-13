import { createDrawerNavigator } from '@react-navigation/drawer';
import { useStyles } from 'react-native-unistyles';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';
import { StyledDrawer, StyledIcons } from '@/components';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  const { theme } = useStyles();

  return (
    <Drawer.Navigator
      drawerContent={props => <StyledDrawer {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="Home"
        component={HomeTipScreen}
        options={{
          drawerLabel: 'Tip & Split',
          drawerActiveTintColor: theme.colors.accent,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
