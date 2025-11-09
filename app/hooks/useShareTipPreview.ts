import { useState, useRef } from 'react';
import { useShareTipDetailsText, formatTipDetailsPreview } from './useShareTipDetailsText';
import { useShareTipDetailsPDF } from './useShareTipDetailsPDF';
import type { ShareTipDetailsParams } from './useShareTipDetailsText';
import { Platform } from 'react-native';

type ShareTipData = Omit<ShareTipDetailsParams, 'title' | 'subject'>;

interface UseShareTipPreviewReturn {
    isPreviewVisible: boolean;
    previewContent: string;
    openPreview: () => void;
    closePreview: () => void;
    shareAsText: () => void;
    shareAsPDF: () => void;
    handleModalDismiss: () => void;
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
 *   shareAsPDF,
 *   handleModalDismiss
 * } = useShareTipPreview(shareData);
 * ```
 */
export const useShareTipPreview = (shareData: ShareTipData | null): UseShareTipPreviewReturn => {
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const pendingShareAction = useRef<'text' | 'pdf' | null>(null);

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

    const HandlePendingShareAction = () => {
        if (pendingShareAction.current && shareData) {
            const action = pendingShareAction.current;
            pendingShareAction.current = null;

            // Execute share action after modal has been dismissed
            if (action === 'text') {
                useShareTipDetailsText(shareData).catch(error => {
                    console.error('Error sharing as text:', error);
                });
            } else if (action === 'pdf') {
                useShareTipDetailsPDF(shareData).catch(error => {
                    console.error('Error sharing as PDF:', error);
                });
            }
        }
    }

    // Handle modal dismiss - executes pending share action (iOS only)
    const handleModalDismiss = () => {
        HandlePendingShareAction();
    };

    // Share as text - sets pending action and closes modal
    const shareAsText = () => {
        if (!shareData) return;
        pendingShareAction.current = 'text';
        setIsPreviewVisible(false);

        Platform.OS !== 'ios' && HandlePendingShareAction();
    };

    // Share as PDF - sets pending action and closes modal
    const shareAsPDF = () => {
        if (!shareData) return;
        pendingShareAction.current = 'pdf';
        setIsPreviewVisible(false);

        Platform.OS !== 'ios' && HandlePendingShareAction();
    };

    return {
        isPreviewVisible,
        previewContent,
        openPreview,
        closePreview,
        shareAsText,
        shareAsPDF,
        handleModalDismiss,
    };
};
