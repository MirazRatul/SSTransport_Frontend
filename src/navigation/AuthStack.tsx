import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CommonAuth from '../screens/auth/CommonAuth';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name="CommonAuth" component={CommonAuth} />
    </Stack.Navigator>
  );
};

export default AuthStack;
