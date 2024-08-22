import { createDrawerNavigator } from '@react-navigation/drawer';
import { useStyles } from 'react-native-unistyles';
// Components
import { StyledDrawer } from '@components';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';
// import SavedTipsScreen from '@/screens/TipScreens/SavedTipsScreen';
import SettingsScreen from '@/screens/TipScreens/SettingsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
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
          drawerLabelStyle: {
            fontFamily: theme.fonts.Montserrat_Bold,
            fontWeight: undefined,
            fontSize: 14,
          },
        }}
      />
      {/* <Drawer.Screen
        name="SavedTipScreen"
        component={SavedTipsScreen}
        options={{
          drawerLabel: 'History & Summary',
          drawerLabelStyle: {
            fontFamily: theme.fonts.Montserrat_Bold,
            fontWeight: undefined,
            fontSize: 14,
          },
        }}
      /> */}
      <Drawer.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings & Preferences',
          drawerLabelStyle: {
            fontFamily: theme.fonts.Montserrat_Bold,
            fontWeight: undefined,
            fontSize: 14,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
