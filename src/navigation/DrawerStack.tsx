import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTab from './BottomTab';
import { scale as s } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import { House, Van } from 'lucide-react-native';
import Profile from '../screens/profile/Profile';
import TripList from '../screens/trip/TripList';

const AppDrawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <AppDrawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: AppColors.cardColor,
          width: s(250),
        },
        drawerActiveTintColor: AppColors.secondaryColor,
        drawerInactiveTintColor: '#ffffff',
        drawerLabelStyle: {
          fontSize: s(13),
          fontWeight: 'bold',
        },
      }}
    >
      <AppDrawer.Screen
        name="BottomTab"
        component={BottomTab}
        options={{
          drawerIcon: ({color}) => <House size={s(20)} color={color}/>, title: 'Home'
          
        }}
      />
      <AppDrawer.Screen
      name="Trip"
      component={TripList}
      options={{
        drawerIcon: ({color}) => {
          return(
            <Van size={s(20)} color={color}/>
          )
        }
      }}
      />
    </AppDrawer.Navigator>
  );
};

export default DrawerStack;
