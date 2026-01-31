import { createDrawerNavigator } from '@react-navigation/drawer';
import { useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
// Components
import { StyledDrawer } from '@components';
// Screens
import HomeTipScreen from '@/screens/TipScreens/HomeTipScreen';
import SavedTipsScreen from '@/screens/TipScreens/SavedTipsScreen';
import SettingsScreen from '@/screens/TipScreens/SettingsScreen';
import AboutUsScreen from '@/screens/AppInfoScreens/AboutUsScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const { theme, rt } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={props => <StyledDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerActiveTintColor: theme.colors.accent,
        drawerInactiveTintColor: theme.colors.card_typography,
        drawerItemStyle: {
          marginVertical: (rt.screen.height * 0.5) / 100,
        },
      }}
    >
      <Drawer.Screen
        name="CalcTipScreen"
        component={HomeTipScreen}
        options={{
          drawerLabel: t('navigation.tipSplit'),
          drawerLabelStyle: {
            fontFamily: theme.fonts.Montserrat_Bold,
            fontWeight: undefined,
            fontSize: 14,
          },
        }}
      />
      <Drawer.Screen
        name="SavedTipScreen"
        component={SavedTipsScreen}
        options={{
          drawerLabel: t('navigation.tipSummary'),
          drawerLabelStyle: {
            fontFamily: theme.fonts.Montserrat_Bold,
            fontWeight: undefined,
            fontSize: 14,
          },
        }}
      />
      <Drawer.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          drawerLabel: t('navigation.settingsPreferences'),
          drawerLabelStyle: {
            fontFamily: theme.fonts.Montserrat_Bold,
            fontWeight: undefined,
            fontSize: 14,
          },
        }}
      />
      <Drawer.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
