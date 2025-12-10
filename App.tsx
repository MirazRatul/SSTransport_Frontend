import { NewAppScreen } from '@react-native/new-app-screen';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppButton from './src/components/AppButton';
import { useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AppButton title='Login' onPress={()=>Alert.alert("Welcome to home")} isLoading={isLoading}/>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 24,
  }
});

export default App;
