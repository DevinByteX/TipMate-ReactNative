/**
 * Central navigation type definitions for React Navigation.
 * Import these instead of defining local route param types per-file.
 */

import { SavedTip } from '@/context/types';

export type RootStackParamList = {
    MainStack: undefined;
    SavedTipDetailScreen: { tip: SavedTip };
    CustomSplitScreen: {
        totalBill: number;
        tipPercentage: number;
        currencySymbol: string;
        presetId?: string;
    };
    LicensesScreen: undefined;
    LicenseContentModal: undefined;
};

/**
 * Register RootStackParamList globally so useNavigation() is typed across
 * all navigators (including cross-navigator calls from drawer screens).
 */
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
