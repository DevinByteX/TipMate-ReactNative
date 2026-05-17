import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { shareTipText, shareTipPDF, formatTipDetailsPreview } from '@/utils/tipSharing';
import type { ShareTipDetailsParams, ShareTranslations, PDFTranslations } from '@/utils/tipSharing';
import { Platform } from 'react-native';
import { useUserSettings } from '@/context/AppContext';
import { getLocaleForFormatting } from '@/localization';

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
    const { t } = useTranslation();
    const { state: settingsState } = useUserSettings();
    const locale = getLocaleForFormatting(settingsState.language);

    // Build translations object from i18n
    const shareTranslations: ShareTranslations = useMemo(() => ({
        tipSummary: t('share.tipSummary'),
        billAmount: t('share.billAmount'),
        tipPercentage: t('share.tipPercentage'),
        tipAmount: t('share.tipAmount'),
        totalAmount: t('share.totalAmount'),
        splitAmong: t('share.splitAmong'),
        persons: t('share.persons'),
        subtotalPerPerson: t('share.subtotalPerPerson'),
        tipPerPerson: t('share.tipPerPerson'),
        totalPerPerson: t('share.totalPerPerson'),
        sharedVia: t('share.sharedVia'),
        customSplitLabel: t('share.customSplitLabel'),
        individualSplit: t('share.individualSplit'),
    }), [t]);

    // Build PDF translations object from i18n
    const pdfTranslations: PDFTranslations = useMemo(() => ({
        thankYou: t('share.pdf.thankYou'),
        tipSummaryDescription: t('share.pdf.tipSummaryDescription'),
        receiptId: t('share.receipt'),
        date: t('share.date'),
        time: t('share.time'),
        amount: t('share.pdf.amount'),
        billDetails: t('share.pdf.billDetails'),
        billAmount: t('share.billAmount').replace(':', ''),
        tip: t('components.billBox.tip'),
        totalAmount: t('share.totalAmount').replace(':', ''),
        splitDetails: t('share.pdf.splitDetails'),
        people: t('screens.savedTipDetail.people'),
        subtotalPerPerson: t('share.subtotalPerPerson').replace(':', ''),
        tipPerPerson: t('share.tipPerPerson').replace(':', ''),
        totalPerPerson: t('share.totalPerPerson').replace(':', ''),
        generatedBy: t('share.pdf.generatedBy'),
        tagline: t('screens.home.tagline'),
        shareTitle: t('share.shareYourTip'),
        shareSubject: t('share.tipMateSummary'),
    }), [t]);

    // Generate preview content
    const previewContent = useMemo(
        () => shareData ? formatTipDetailsPreview({ ...shareData, translations: shareTranslations }) : '',
        [shareData, shareTranslations],
    );

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
                shareTipText({ ...shareData, translations: shareTranslations }).catch(error => {
                    console.error('Error sharing as text:', error);
                });
            } else if (action === 'pdf') {
                shareTipPDF(shareData, pdfTranslations, locale).catch(error => {
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
