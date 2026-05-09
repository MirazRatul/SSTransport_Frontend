/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setBackgroundMessageHandler } from './src/services/pushNotifications';

setBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
