import React from 'react';
import 'react-native-unistyles'; // Per the Unitstyles FAQ, add this configuration in the root file (e.g., `app.js` or `index.js`)a
import '@styles/uniStyles'; // This should always be imported in the root file of the app, such as app.js or index.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ApplicationNavigator from '@navigation/ApplicationNavigation';
import AppProvider from './context/AppContext';

/**
 * important to keep the GestureHandlerRootView as close to the actual root view as possible.
 * Root means the very top of your component tree.
 * if you want it to fill the screen, you will need to pass { flex: 1 } like you'll need to do with a normal View
 */

const Entrypoint = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ApplicationNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
};

export default Entrypoint;
