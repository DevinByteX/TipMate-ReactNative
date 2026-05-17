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
import { asyncStorageUtil } from './asyncStorageUtil';
import {
  getUserPreferredTheme,
  setUserPreferredTheme,
  getUserUpdatedThemeOption,
  setUserUpdatedThemeOption,
} from './asyncStorageHooks';
import { usePersistedReducer } from './usePersistedReducer';
import { validateOptionValues, areOptionArraysSame } from '@/utils/optionsValidation';
import { useThemeColorCustomiser, CustomisedTheme } from './useThemeColorCustomiser';
import { useExternalLinkAlert, ExternalLinkAlertConfig } from './useExternalLinkAlert';
import { useShareTipDetailsText, formatTipDetailsPreview, ShareTipDetailsParams, ShareTranslations } from './useShareTipDetailsText';
import { useShareTipDetailsPDF, TipDetailsForPDF, PDFTranslations } from './useShareTipDetailsPDF';
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
  useThemeColorCustomiser,
  useExternalLinkAlert,
  useShareTipDetailsText,
  formatTipDetailsPreview,
  useShareTipDetailsPDF,
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
