import { StyleSheet } from 'react-native';
import './src/config/GoogleSignIn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/MainStack';
import { Provider } from 'react-redux';
import store from './src/store/store';
import DrawerStack from './src/navigation/DrawerStack';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          {/* <DrawerStack /> */}
          <MainStack />
        </NavigationContainer>
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
