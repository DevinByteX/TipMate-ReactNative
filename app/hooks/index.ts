import { convertToTwoDecimalPoints, acceptNumbersAndDecimals, toFixedWithoutRounding } from '@/utils/numberFormatting';
import {
  calculateBillValues,
  calculateBillValuesCustomSplit,
  BillCalculationType,
  CustomSplitCalculationType,
  RoundingMethodType,
  RoundingMethod,
  DisabledRoundingMethodsType,
} from '@/utils/billCalculation';
import { asyncStorageUtil } from '@/utils/asyncStorage';
import {
  getUserPreferredTheme,
  setUserPreferredTheme,
  getUserUpdatedThemeOption,
  setUserUpdatedThemeOption,
} from '@/utils/themeStorage';
import type { CustomisedTheme } from '@/utils/themeStorage';
import { usePersistedReducer } from './usePersistedReducer';
import { validateOptionValues, areOptionArraysSame } from '@/utils/optionsValidation';
import { applyThemeColors } from '@/utils/themeCustomization';
import { useExternalLinkAlert, ExternalLinkAlertConfig } from './useExternalLinkAlert';
import { shareTipText, shareTipPDF, formatTipDetailsPreview, ShareTipDetailsParams, ShareTranslations, TipDetailsForPDF, PDFTranslations } from '@/utils/tipSharing';
import { useShareTipPreview } from './useShareTipPreview';
import { useSaveTip } from './useSaveTip';
import { getDeviceCurrency } from '@/utils/deviceCurrency';
import {
  usePressAnimation,
  useFocusScale,
  useScaleSpring,
  useValuePulse,
  useBounce,
  useVisibilityAnimation,
  useModalEntrance,
  useBottomSheetEntrance,
} from './useAnimations';
import { useCustomSplitEditor, CustomSplitEditorReturn } from './useCustomSplitEditor';
import {
  useTipOptionsSelector,
  useSplitOptionsSelector,
  useTipOptionsEditSelector,
  useSplitOptionsEditSelector,
  useCurrencySelectorData,
  useLanguageSelectorData,
  useDuplicatePreventionSelectorData,
} from './contextSelectors';

export {
  convertToTwoDecimalPoints,
  acceptNumbersAndDecimals,
  calculateBillValues,
  calculateBillValuesCustomSplit,
  RoundingMethod,
  toFixedWithoutRounding,
  asyncStorageUtil,
  getUserPreferredTheme,
  setUserPreferredTheme,
  getUserUpdatedThemeOption,
  setUserUpdatedThemeOption,
  usePersistedReducer,
  validateOptionValues,
  areOptionArraysSame,
  applyThemeColors,
  useExternalLinkAlert,
  shareTipText,
  shareTipPDF,
  formatTipDetailsPreview,
  useShareTipPreview,
  useSaveTip,
  getDeviceCurrency,
  usePressAnimation,
  useFocusScale,
  useScaleSpring,
  useValuePulse,
  useBounce,
  useVisibilityAnimation,
  useModalEntrance,
  useBottomSheetEntrance,
  useCustomSplitEditor,
  useTipOptionsSelector,
  useSplitOptionsSelector,
  useTipOptionsEditSelector,
  useSplitOptionsEditSelector,
  useCurrencySelectorData,
  useLanguageSelectorData,
  useDuplicatePreventionSelectorData,
};
export type {
  BillCalculationType,
  CustomSplitCalculationType,
  RoundingMethodType,
  DisabledRoundingMethodsType,
  CustomisedTheme,
  ExternalLinkAlertConfig,
  ShareTipDetailsParams,
  ShareTranslations,
  TipDetailsForPDF,
  PDFTranslations,
  CustomSplitEditorReturn,
};
