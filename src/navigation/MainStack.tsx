import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import BottomTab from './BottomTab';
import AuthStack from './AuthStack';
import auth from '@react-native-firebase/auth';
import BootSplash from 'react-native-bootsplash';
import EmployeeDetails from '../screens/employee/EmployeeDetails';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VehiclesDetails from '../screens/vehicles/VehiclesDetails';
import DrawerStack from './DrawerStack';
import TripDetails from '../screens/trip/TripDetails';
import AddVehicle from '../screens/vehicles/AddVehicle';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

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
          <Stack.Screen name="TripDetails" component={TripDetails}/>
        </>
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
