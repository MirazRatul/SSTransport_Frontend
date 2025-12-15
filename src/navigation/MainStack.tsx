import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BottomTab from './BottomTab';
import AuthStack from './AuthStack';

const MainStack = () => {
  const Stack = createNativeStackNavigator();
  return <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
    <Stack.Screen name='BottomTab' component={BottomTab}/>
    <Stack.Screen name='AuthStack' component={AuthStack}/>
  </Stack.Navigator>;
};

export default MainStack;
