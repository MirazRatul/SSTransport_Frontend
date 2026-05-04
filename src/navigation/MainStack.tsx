import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BootSplash from 'react-native-bootsplash';
import EmployeeDetails from '../screens/employee/EmployeeDetails';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VehiclesDetails from '../screens/vehicles/VehiclesDetails';
import DrawerStack from './DrawerStack';
import TripDetails from '../screens/trip/TripDetails';
import AddVehicle from '../screens/vehicles/AddVehicle';
import AddTrip from '../screens/trip/AddTrip';
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  // ─── Listen to app state (foreground/background) ────────────────────────
  useEffect(() => {
    if (!user?.uid) return;

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    async function handleAppStateChange(state: AppStateStatus) {
      const presenceRef = firestore().collection('presence').doc(user.uid);
      
      if (state === 'background' || state === 'inactive') {
        // App is backgrounded or closed
        console.log('📱 App backgrounded/closed. Setting user offline:', user.uid);
        presenceRef.set(
          {
            online: false,
            lastSeen: new Date(),
          },
          { merge: true }
        )
          .catch(error => console.log('❌ Error setting offline:', error.message));
      } else if (state === 'active') {
        // App came back to foreground
        console.log('📱 App active. Setting user online:', user.uid);
        presenceRef.set(
          {
            online: true,
            lastSeen: new Date(),
          },
          { merge: true }
        )
          .catch(error => console.log('❌ Error setting online:', error.message));
      }
    }

    return () => {
      appStateSubscription.remove();
    };
  }, [user?.uid]);

  // ─── Set user online status in Firestore ────────────────────────────────
  useEffect(() => {
    if (!user?.uid) {
      console.log('No user UID, skipping presence update');
      return;
    }

    const presenceRef = firestore().collection('presence').doc(user.uid);

    // Set user online
    console.log('Setting user online:', user.uid);
    presenceRef.set(
      {
        online: true,
        lastSeen: new Date(),
      },
      { merge: true }
    )
      .then(() => {
        console.log('✅ Online status set successfully for', user.uid);
        // Verify it was written
        presenceRef.get().then(snap => {
          console.log('✅ Verified presence doc:', snap.data());
        });
      })
      .catch(error => console.log('❌ Error setting online status:', error));

    // Clean up: set offline when unmounting or user logs out
    return () => {
      console.log('Setting user offline:', user.uid);
      presenceRef.set(
        {
          online: false,
          lastSeen: new Date(),
        },
        { merge: true }
      )
        .catch(error => console.log('❌ Error setting offline status:', error));
    };
  }, [user?.uid]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const alreadyLaunched = await AsyncStorage.getItem('onboarding');
      if (alreadyLaunched === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };

    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      (async () => {
        if (currentUser) {
          try {
            // reload to ensure emailVerified is up-to-date
            await currentUser.reload();
          } catch {
            // ignore reload errors
          }

          const verified = auth().currentUser?.emailVerified ?? false;
          setUser(verified ? auth().currentUser : null);
        } else {
          setUser(null);
        }

        setInitializing(false);
      })();
    });

    checkOnboarding();

    return unsubscribe;
  }, []);

  // Hide BootSplash after navigator is ready
  useEffect(() => {
    if (!initializing && isFirstLaunch !== null) {
      BootSplash.hide({ fade: true });
    }
  }, [initializing, isFirstLaunch]);

  if (initializing || isFirstLaunch === null) {
    return null; 
  } // keep splash visible

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {isFirstLaunch ? (
        <Stack.Screen name="onboarding">
          {props => (
            <OnboardingScreen 
              {...props} 
              //function to update state when done
              onFinish={() => setIsFirstLaunch(false)} 
            />
          )}
        </Stack.Screen>
      ) : user ? (
        <>
          <Stack.Screen name="DrawerTab" component={DrawerStack} />
          <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} />
          <Stack.Screen name="VehicleDetails" component={VehiclesDetails}/>
          <Stack.Screen name="AddVehicle" component={AddVehicle}/>
          <Stack.Screen name="AddTrip" component={AddTrip}/>
          <Stack.Screen name="TripDetails" component={TripDetails}/>
          <Stack.Screen name="ChatScreen" component={ChatScreen}/>
        </>
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
