import React from 'react';
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
