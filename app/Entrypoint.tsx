import React from 'react';
import '@styles/uniStyles'; // This should always be imported in the root file of the app, such as app.js or index.
import ApplicationNavigator from '@navigation/ApplicationNavigation';
import Toast from 'react-native-toast-message';
import { AppProvider } from './context/AppContext';
import { toastConfig } from '@styles/toastConfig';

const Entrypoint = () => {
  return (
    <AppProvider>
      <ApplicationNavigator />
      <Toast config={toastConfig} />
    </AppProvider>
  );
};

export default Entrypoint;
