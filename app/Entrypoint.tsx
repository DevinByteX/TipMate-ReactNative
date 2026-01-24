import React, { useEffect, useState, useCallback } from 'react';
import 'react-native-unistyles'; // Per the Unitstyles FAQ, add this configuration in the root file (e.g., `app.js` or `index.js`)a
import '@styles/uniStyles'; // This should always be imported in the root file of the app, such as app.js or index.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApplicationNavigator from '@navigation/ApplicationNavigation';
import AppProvider from './context/AppContext';
import { initializeI18n, applyRTLSync, DEFAULT_LANGUAGE } from './localization';
import { Constants } from '@configs';

/**
 * important to keep the GestureHandlerRootView as close to the actual root view as possible.
 * Root means the very top of your component tree.
 * if you want it to fill the screen, you will need to pass { flex: 1 } like you'll need to do with a normal View
 *
 * OPTIMIZATION: i18n initialization runs in parallel with RTL detection
 * and uses synchronous initialization where possible.
 */

const Entrypoint = () => {
  const [isI18nReady, setIsI18nReady] = useState(false);

  const initI18n = useCallback(async () => {
    try {
      // Start AsyncStorage read - don't block on it if possible
      const storedStatePromise = AsyncStorage.getItem(Constants.APP_STATE_ASYNCSTORAGE_KEY);

      // Initialize i18n with default first (fast path)
      initializeI18n(DEFAULT_LANGUAGE);

      // Then check for stored preference
      const storedState = await storedStatePromise;
      let storedLanguage = DEFAULT_LANGUAGE;

      if (storedState) {
        const parsedState = JSON.parse(storedState);
        storedLanguage = parsedState.language || DEFAULT_LANGUAGE;

        // Only re-init if different from default
        if (storedLanguage !== DEFAULT_LANGUAGE) {
          initializeI18n(storedLanguage);
        }
      }

      // Apply RTL settings (needed for proper layout)
      applyRTLSync(storedLanguage);
      setIsI18nReady(true);
    } catch (error) {
      console.warn('Failed to initialize i18n:', error);
      // Already initialized with default, just mark ready
      setIsI18nReady(true);
    }
  }, []);

  useEffect(() => {
    initI18n();
  }, [initI18n]);

  // Show loading indicator while i18n initializes
  if (!isI18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ApplicationNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
};

export default Entrypoint;
