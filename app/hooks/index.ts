import { convertToTwoDecimalPoints, acceptNumbersAndDecimals } from './convertToTwoDecimals';
import {
  calculateBillValues,
  BillCalculationType,
  RoundingMethodType,
  RoundingMethod,
  DisabledRoundingMethodsType,
} from './calculateBill';
import { asyncStorageUtil } from './asyncStorageUtil';
import {
  getUserPreferredTheme,
  setUserPreferredTheme,
  getUserUpdatedThemeOption,
  setUserUpdatedThemeOption,
} from './asyncStorageHooks';
import { toFixedWithoutRounding } from './tofixedWithoutRounding';
import { usePersistedReducer } from './usePersistedReducer';
import { validateOptionValues, areOptionArraysSame } from './validationHooks';
import { useThemeColorCustomiser, CustomisedTheme } from './useThemeColorCustomiser';
import { useExternalLinkAlert, ExternalLinkAlertConfig } from './useExternalLinkAlert';
import { useShareTipDetailsText, formatTipDetailsPreview, ShareTipDetailsParams, ShareTranslations } from './useShareTipDetailsText';
import { useShareTipDetailsPDF, TipDetailsForPDF, PDFTranslations } from './useShareTipDetailsPDF';
import { useShareTipPreview } from './useShareTipPreview';
import { useSaveTip } from './useSaveTip';
import { getDeviceCurrency } from './currencyUtils';
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

export {
  convertToTwoDecimalPoints,
  acceptNumbersAndDecimals,
  calculateBillValues,
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
};
export type {
  BillCalculationType,
  RoundingMethodType,
  DisabledRoundingMethodsType,
  CustomisedTheme,
  ExternalLinkAlertConfig,
  ShareTipDetailsParams,
  ShareTranslations,
  TipDetailsForPDF,
  PDFTranslations,
};
