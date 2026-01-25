import React from 'react';
import 'react-native-unistyles'; // Per the Unitstyles FAQ, add this configuration in the root file (e.g., `app.js` or `index.js`)a
import '@styles/uniStyles'; // This should always be imported in the root file of the app, such as app.js or index.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ApplicationNavigator from '@navigation/ApplicationNavigation';
import AppProvider from './context/AppContext';
import { initializeI18n, applyRTLSync, getCurrentLanguage } from './localization';

/**
 * important to keep the GestureHandlerRootView as close to the actual root view as possible.
 * Root means the very top of your component tree.
 * if you want it to fill the screen, you will need to pass { flex: 1 } like you'll need to do with a normal View
 *
 * OPTIMIZATION: i18n initializes synchronously with device language.
 * AppProvider syncs with user's saved language preference after persisted state loads.
 * Device locale is NOT persisted - only user's explicit language changes are saved.
 * This eliminates the loading screen and improves cold start.
 */

// Initialize i18n immediately with device language (synchronous, no blocking)
initializeI18n();
applyRTLSync(getCurrentLanguage());

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
