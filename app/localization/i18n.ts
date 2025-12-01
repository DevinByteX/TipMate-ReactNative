/**
 * i18next configuration for TipMate
 * Supports 9 languages with RTL support for Arabic
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './localizationConfig';

// Import all translation files
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import si from './locales/si.json';
import ar from './locales/ar.json';

// Translation resources
const resources = {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    si: { translation: si },
    ar: { translation: ar },
};

/**
 * Get the best matching language from device locales
 */
const getDeviceLanguage = (): string => {
    try {
        const locales = getLocales();
        if (locales && locales.length > 0) {
            // Try to find exact match first
            for (const locale of locales) {
                const langCode = locale.languageCode;
                const fullTag = locale.languageTag;

                // Check for exact match (e.g., zh-Hans)
                if (SUPPORTED_LANGUAGES.some(lang => lang.code === fullTag)) {
                    return fullTag;
                }

                // Check for language code match (e.g., en, es, fr)
                if (SUPPORTED_LANGUAGES.some(lang => lang.code === langCode)) {
                    return langCode;
                }
            }
        }
    } catch (error) {
        console.warn('Failed to get device language:', error);
    }

    return DEFAULT_LANGUAGE;
};

/**
 * Initialize i18next with the detected or stored language
 * @param storedLanguage - Previously stored language preference from AsyncStorage
 */
export const initializeI18n = (storedLanguage?: string): void => {
    const language = storedLanguage || getDeviceLanguage();

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
 * @param languageCode - The language code to switch to
 */
export const changeLanguage = async (languageCode: string): Promise<void> => {
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
