/**
 * RTL (Right-to-Left) management hook for TipMate
 * Handles RTL layout changes when switching to/from Arabic
 */

import { useCallback, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { isRTLLanguage } from './localizationConfig';

export interface UseRTLReturn {
    isRTL: boolean;
    shouldRestartForRTL: (newLanguage: string) => boolean;
    applyRTL: (languageCode: string) => boolean;
}

/**
 * Hook to manage RTL layout state
 * @returns Object with RTL state and helper functions
 */
export const useRTL = (): UseRTLReturn => {
    const [isRTL, setIsRTL] = useState<boolean>(I18nManager.isRTL);

    useEffect(() => {
        setIsRTL(I18nManager.isRTL);
    }, []);

    /**
     * Check if switching to a new language requires app restart
     * Returns true if switching between RTL and LTR languages
     */
    const shouldRestartForRTL = useCallback(
        (newLanguage: string): boolean => {
            const newIsRTL = isRTLLanguage(newLanguage);
            return newIsRTL !== isRTL;
        },
        [isRTL],
    );

    /**
     * Apply RTL settings for a language
     * Returns true if restart is required
     */
    const applyRTL = useCallback(
        (languageCode: string): boolean => {
            const newIsRTL = isRTLLanguage(languageCode);

            if (newIsRTL !== I18nManager.isRTL) {
                I18nManager.allowRTL(newIsRTL);
                I18nManager.forceRTL(newIsRTL);
                setIsRTL(newIsRTL);
                return true; // Restart required
            }

            return false; // No restart needed
        },
        [],
    );

    return {
        isRTL,
        shouldRestartForRTL,
        applyRTL,
    };
};

/**
 * Get current RTL state without hook (for initialization)
 */
export const getCurrentRTLState = (): boolean => {
    return I18nManager.isRTL;
};

/**
 * Apply RTL settings synchronously (for app initialization)
 */
export const applyRTLSync = (languageCode: string): void => {
    const shouldBeRTL = isRTLLanguage(languageCode);
    if (shouldBeRTL !== I18nManager.isRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
    }
};

export default useRTL;
