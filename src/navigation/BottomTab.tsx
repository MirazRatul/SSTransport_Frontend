import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Heart,
  LayoutDashboard,
  Truck,
  IdCardLanyard,
  User,
  Van,
} from 'lucide-react-native';
import { AppColors } from '../styles/colors';
import EmployeeList from '../screens/employee/EmployeeList';
import DashBoard from '../screens/home/DashBoard';
import { scale as s, vs } from 'react-native-size-matters';
import Profile from '../screens/profile/Profile';
import TripList from '../screens/trip/TripList';

const BottomTab = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppColors.secondaryColor,
        tabBarInactiveTintColor: AppColors.textColor,
        tabBarLabelStyle: {
          fontSize: s(11),
        },
        tabBarStyle: {
          borderTopColor: AppColors.cardColor,
          backgroundColor: AppColors.primaryColor,
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={s(20)} color={color} />
          ),
          title: 'Dashboard',
        }}
        name="DashBoard"
        component={DashBoard}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color }) => (
            <IdCardLanyard size={s(20)} color={color} />
          ),
          title: 'Employee',
        }}
        name="EmployeeList"
        component={EmployeeList}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color }) => <Van size={s(20)} color={color} />,
          title: 'Trips',
        }}
        name="TripList"
        component={TripList}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color }) => <User size={s(20)} color={color} />,
          title: 'Profile',
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
