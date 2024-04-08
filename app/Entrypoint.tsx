import React from 'react';
import '@styles/uniStyles'; // This should always be imported in the root file of the app, such as app.js or index.
import ApplicationNavigator from './navigation/ApplicationNavigation';

const Entrypoint = () => {
  return <ApplicationNavigator />;
};

export default Entrypoint;
