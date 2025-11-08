import { useState } from 'react';
import { useShareTipDetailsText, formatTipDetailsPreview } from './useShareTipDetailsText';
import { useShareTipDetailsPDF } from './useShareTipDetailsPDF';
import type { ShareTipDetailsParams } from './useShareTipDetailsText';

type ShareTipData = Omit<ShareTipDetailsParams, 'title' | 'subject'>;

interface UseShareTipPreviewReturn {
    isPreviewVisible: boolean;
    previewContent: string;
    openPreview: () => void;
    closePreview: () => void;
    shareAsText: () => Promise<void>;
    shareAsPDF: () => Promise<void>;
}

/**
 * Custom hook for managing tip share preview functionality
 * Handles the preview modal state and share actions for tip details
 *
 * @param shareData - The tip data to be shared
 * @returns Object containing preview state and share handlers
 *
 * @example
 * ```tsx
 * const shareData = {
 *   amount: 100,
 *   tip: 15,
 *   total: 115,
 *   tipPercentage: 15,
 *   numberOfPeople: 2,
 *   currencySymbol: '$'
 * };
 *
 * const {
 *   isPreviewVisible,
 *   previewContent,
 *   openPreview,
 *   closePreview,
 *   shareAsText,
 *   shareAsPDF
 * } = useShareTipPreview(shareData);
 * ```
 */
export const useShareTipPreview = (shareData: ShareTipData | null): UseShareTipPreviewReturn => {
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

    // Generate preview content
    const previewContent = shareData ? formatTipDetailsPreview(shareData) : '';

    // Open the preview modal
    const openPreview = () => {
        if (shareData) {
            setIsPreviewVisible(true);
        }
    };

    // Close the preview modal
    const closePreview = () => {
        setIsPreviewVisible(false);
    };

    // Share as text
    const shareAsText = async () => {
        if (!shareData) return;

        setIsPreviewVisible(false);
        try {
            await useShareTipDetailsText(shareData);
        } catch (error) {
            console.error('Error sharing as text:', error);
            throw error;
        }
    };

    // Share as PDF
    const shareAsPDF = async () => {
        if (!shareData) return;

        setIsPreviewVisible(false);
        try {
            await useShareTipDetailsPDF(shareData);
        } catch (error) {
            console.error('Error sharing as PDF:', error);
            throw error;
        }
    };

    return {
        isPreviewVisible,
        previewContent,
        openPreview,
        closePreview,
        shareAsText,
        shareAsPDF,
    };
};
