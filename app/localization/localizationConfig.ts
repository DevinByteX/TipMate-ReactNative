/**
 * Language configuration for TipMate internationalization
 */

export interface LanguageConfig {
    code: string;
    name: string;
    nativeName: string;
    isRTL: boolean;
    fontFamily?: string;
}

/**
 * Supported languages in TipMate
 * Phase 1: 9 languages including RTL Arabic and Sinhala with custom font
 */
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
    {
        code: 'si',
        name: 'Sinhala',
        nativeName: 'සිංහල',
        isRTL: false,
        fontFamily: 'NotoSansSinhala',
    },
    // { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
];

/**
 * RTL language codes for quick lookup
 */
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Default language fallback
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Get language configuration by code
 */
export const getLanguageConfig = (code: string): LanguageConfig | undefined => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

/**
 * Check if a language code is RTL
 */
export const isRTLLanguage = (code: string): boolean => {
    return RTL_LANGUAGES.includes(code);
};

/**
 * Get font family for a language
 * Returns custom font for Sinhala, undefined for others (uses default app font)
 */
export const getFontFamilyForLanguage = (
    code: string,
    weight: 'Regular' | 'Medium' | 'SemiBold' | 'Bold' = 'Regular',
): string | undefined => {
    const config = getLanguageConfig(code);
    if (config?.fontFamily) {
        return `${config.fontFamily}-${weight}`;
    }
    return undefined;
};

/**
 * Get locale code for date/time formatting
 * Maps language codes to proper locale codes
 */
export const getLocaleForFormatting = (code: string): string => {
    const localeMap: Record<string, string> = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        si: 'si-LK',
        ar: 'ar-SA',
    };
    return localeMap[code] || 'en-US';
};
