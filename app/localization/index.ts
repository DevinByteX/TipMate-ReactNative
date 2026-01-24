/**
 * Localization module exports for TipMate
 */

export {
    default as i18n,
    initializeI18n,
    changeLanguage,
    getCurrentLanguage,
    isI18nInitialized,
} from './i18n';

export {
    SUPPORTED_LANGUAGES,
    RTL_LANGUAGES,
    DEFAULT_LANGUAGE,
    getLanguageConfig,
    isRTLLanguage,
    getFontFamilyForLanguage,
    getLocaleForFormatting,
} from './localizationConfig';

export type { LanguageConfig } from './localizationConfig';

export { useRTL, getCurrentRTLState, applyRTLSync } from './useRTL';

export type { UseRTLReturn } from './useRTL';
