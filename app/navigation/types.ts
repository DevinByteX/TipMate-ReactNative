/**
 * Central navigation type definitions for React Navigation.
 * Import these instead of defining local route param types per-file.
 */

export type RootStackParamList = {
    MainStack: undefined;
    SavedTipDetailScreen: undefined;
    CustomSplitScreen: {
        totalBill: number;
        tipPercentage: number;
        currencySymbol: string;
        presetId?: string;
    };
    LicensesScreen: undefined;
    LicenseContentModal: undefined;
};
