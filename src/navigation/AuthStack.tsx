import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import CommonAuth from '../screens/auth/CommonAuth';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name="CommonAuth" component={CommonAuth} />
      <Stack.Screen name="Login" component={SignIn} />
      <Stack.Screen name="registration" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthStack;
