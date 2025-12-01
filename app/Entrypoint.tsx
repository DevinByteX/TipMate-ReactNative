import React, { useEffect, useState } from 'react';
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
 */

const Entrypoint = () => {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const initI18n = async () => {
      try {
        // Get stored language from AsyncStorage
        const storedState = await AsyncStorage.getItem(Constants.APP_STATE_ASYNCSTORAGE_KEY);
        let storedLanguage = DEFAULT_LANGUAGE;

        if (storedState) {
          const parsedState = JSON.parse(storedState);
          storedLanguage = parsedState.language || DEFAULT_LANGUAGE;
        }

        // Apply RTL settings before i18n init (needed for proper layout on app start)
        applyRTLSync(storedLanguage);

        // Initialize i18n with stored or default language
        initializeI18n(storedLanguage);

        setIsI18nReady(true);
      } catch (error) {
        console.warn('Failed to initialize i18n:', error);
        // Initialize with default language on error
        initializeI18n(DEFAULT_LANGUAGE);
        setIsI18nReady(true);
      }
    };

    initI18n();
  }, []);

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
