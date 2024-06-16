import { createDrawerNavigator } from '@react-navigation/drawer';
import { useStyles } from 'react-native-unistyles';
// Components
import { StyledDrawer } from '@components';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';
import SavedTipsScreen from '@/screens/TipScreens/SavedTipsScreen';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  const { theme } = useStyles();

  return (
    <Drawer.Navigator
      drawerContent={props => <StyledDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.colors.accent,
        drawerInactiveTintColor: theme.colors.card_typography,
      }}>
      <Drawer.Screen
        name="CalcTipScreen"
        component={HomeTipScreen}
        options={{
          drawerLabel: 'Tip & Split',
        }}
      />
      <Drawer.Screen
        name="SavedTipScreen"
        component={SavedTipsScreen}
        options={{
          drawerLabel: 'History & Summary',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
