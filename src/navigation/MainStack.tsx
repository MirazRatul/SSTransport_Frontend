import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import BottomTab from './BottomTab';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import BootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      (async () => {
        if (currentUser) {
          try {
            // reload to ensure emailVerified is up-to-date
            await currentUser.reload();
          } catch (e) {
            // ignore reload errors
          }

          const verified = auth().currentUser?.emailVerified ?? false;
          setUser(verified ? auth().currentUser : null);
        } else {
          setUser(null);
        }

        if (initializing) setInitializing(false);
      })();
    });

    return unsubscribe;
  }, []);

  // Hide BootSplash after navigator is ready
  useEffect(() => {
    if (!initializing) {
      BootSplash.hide({ fade: true });
    }
  }, [initializing]);

  if (initializing) return null; // keep splash visible

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="BottomTab" component={BottomTab} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
