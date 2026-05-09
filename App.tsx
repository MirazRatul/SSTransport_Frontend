import { StyleSheet } from 'react-native';
import './src/config/GoogleSignIn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/MainStack';
import { Provider } from 'react-redux';
import store from './src/store/store';
import DrawerStack from './src/navigation/DrawerStack';
import { ToastProvider } from './src/components/Toast/ToastContext';
import {
  flushPendingNotificationNavigation,
  navigationRef,
} from './src/navigation/RootNavigation';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ToastProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={flushPendingNotificationNavigation}
          >
            {/* <DrawerStack /> */}
            <MainStack />
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
