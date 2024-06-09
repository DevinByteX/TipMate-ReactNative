/**
 * @format
 */
import 'react-native-gesture-handler'; // add the following at the top (make sure it's at the top and there's nothing else before it) of your entry file, such as index.js or App.js
import { AppRegistry } from 'react-native';
import App from './app/Entrypoint';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
