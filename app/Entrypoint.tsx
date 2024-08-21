import React from 'react';
import 'react-native-unistyles'; // Per the Unitstyles FAQ, add this configuration in the root file (e.g., `app.js` or `index.js`)a
import '@styles/uniStyles'; // This should always be imported in the root file of the app, such as app.js or index.
import ApplicationNavigator from '@navigation/ApplicationNavigation';
import { AppProvider } from './context/AppContext';

const Entrypoint = () => {
  return (
    <AppProvider>
      <ApplicationNavigator />
    </AppProvider>
  );
};

export default Entrypoint;
