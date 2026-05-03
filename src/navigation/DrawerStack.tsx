import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTab from './BottomTab';
import { scale as s } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import { House, MessageCircle, Van } from 'lucide-react-native';
import TripList from '../screens/trip/TripList';
import ChatList from '../screens/chat/ChatList';

const AppDrawer = createDrawerNavigator();

const HomeDrawerIcon = ({ color }: { color: string }) => (
  <House size={s(20)} color={color}/>
);

const TripDrawerIcon = ({ color }: { color: string }) => (
  <Van size={s(20)} color={color}/>
);

const ChatDrawerIcon = ({ color }: { color: string }) => (
  <MessageCircle size={s(20)} color={color}/>
);

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
          drawerIcon: HomeDrawerIcon,
          title: 'Home'
          
        }}
      />
      <AppDrawer.Screen
      name="Trip"
      component={TripList}
      options={{
        drawerIcon: TripDrawerIcon,
      }}
      />
      <AppDrawer.Screen
        name="MyChat"
        component={ChatList}
        options={{
          title: 'My Chat',
          drawerIcon: ChatDrawerIcon,
        }}
      />
    </AppDrawer.Navigator>
  );
};

export default DrawerStack;
