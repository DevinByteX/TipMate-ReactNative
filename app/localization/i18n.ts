/**
 * i18next configuration for TipMate
 * Optimized with lazy loading and caching for better performance
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './localizationConfig';

// Cache for device language to avoid repeated detection
let cachedDeviceLanguage: string | null = null;

// Lazy load translation function
const loadTranslation = (languageCode: string) => {
    switch (languageCode) {
        case 'en':
            return require('./locales/en.json');
        case 'es':
            return require('./locales/es.json');
        case 'fr':
            return require('./locales/fr.json');
        case 'si':
            return require('./locales/si.json');
        case 'ar':
            return require('./locales/ar.json');
        default:
            return require('./locales/en.json');
    }
};

/**
 * Get the best matching language from device locales (cached)
 */
const getDeviceLanguage = (): string => {
    // Return cached value if available
    if (cachedDeviceLanguage) {
        return cachedDeviceLanguage;
    }

    try {
        const locales = getLocales();
        if (locales && locales.length > 0) {
            // Try to find exact match first
            for (const locale of locales) {
                const langCode = locale.languageCode;
                const fullTag = locale.languageTag;

                // Check for exact match (e.g., zh-Hans)
                if (SUPPORTED_LANGUAGES.some(lang => lang.code === fullTag)) {
                    cachedDeviceLanguage = fullTag;
                    return fullTag;
                }

                // Check for language code match (e.g., en, es, fr)
                if (SUPPORTED_LANGUAGES.some(lang => lang.code === langCode)) {
                    cachedDeviceLanguage = langCode;
                    return langCode;
                }
            }
        }
    } catch (error) {
        console.warn('Failed to get device language:', error);
    }

    cachedDeviceLanguage = DEFAULT_LANGUAGE;
    return DEFAULT_LANGUAGE;
};

/**
 * Initialize i18next with the detected or stored language
 * Optimized with lazy loading - only loads the needed language
 * 
 * NOTE: This function is called with storedLanguage ONLY when user has explicitly
 * set a language preference via the UI. Otherwise, it uses device locale without
 * persisting it to storage.
 * 
 * @param storedLanguage - Previously stored language preference from AsyncStorage (user's explicit choice)
 */
export const initializeI18n = (storedLanguage?: string): void => {
    const language = storedLanguage || getDeviceLanguage();

    // Load only the required language and fallback
    const resources: { [key: string]: { translation: any } } = {
        [language]: { translation: loadTranslation(language) },
    };

    // Load fallback language if different from selected
    if (language !== DEFAULT_LANGUAGE) {
        resources[DEFAULT_LANGUAGE] = { translation: loadTranslation(DEFAULT_LANGUAGE) };
    }

    i18n.use(initReactI18next).init({
        resources,
        lng: language,
        fallbackLng: DEFAULT_LANGUAGE,
        compatibilityJSON: 'v4', // Required for React Native
        interpolation: {
            escapeValue: false, // React already handles XSS protection
        },
        react: {
            useSuspense: false, // Disable suspense for React Native
        },
        // Pluralization rules
        pluralSeparator: '_',
        keySeparator: '.',
        nsSeparator: ':',
    });
};

/**
 * Change the current language
 * Handles lazy loading of new language resources
 * @param languageCode - The language code to switch to
 */
export const changeLanguage = async (languageCode: string): Promise<void> => {
    // Check if language resources are already loaded
    if (!i18n.hasResourceBundle(languageCode, 'translation')) {
        // Lazy load the language resources
        const translation = loadTranslation(languageCode);
        i18n.addResourceBundle(languageCode, 'translation', translation);
    }

    await i18n.changeLanguage(languageCode);
};

/**
 * Get the current language code
 */
export const getCurrentLanguage = (): string => {
    return i18n.language || DEFAULT_LANGUAGE;
};

/**
 * Check if i18n is initialized
 */
export const isI18nInitialized = (): boolean => {
    return i18n.isInitialized;
};

export default i18n;
