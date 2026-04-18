import { Constants, CurrencyType } from '@configs';
import {
  SplitOptionState,
  SplitAction,
  TipOptionState,
  TipAction,
  CurrencyConfigAction,
  SavedTip,
  SavedTipAction,
  DuplicatePreventionAction,
  LanguageAction,
  ActiveSplitConfig,
  SplitConfigAction,
  SavedSplitPreset,
  SavedSplitPresetAction,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tipReducer = (state: TipOptionState[], action: TipAction): TipOptionState[] => {
  switch (action.type) {
    case 'UPDATE_TIP_OPTIONS':
      const updatedTips = state.map(tip =>
        tip.place === action.payload.place ? action.payload : tip,
      );
      saveState({ ...state, tips: updatedTips }); // Save updated state to AsyncStorage
      return updatedTips;
    case 'RESET_TIP_OPTIONS_TO_DEFAULT':
      const defaultTipOptionsPayload = action.payload;
      saveState({ ...state, tips: defaultTipOptionsPayload });
      return defaultTipOptionsPayload;
    default:
      return state;
  }
};

export const splitReducer = (
  state: SplitOptionState[],
  action: SplitAction,
): SplitOptionState[] => {
  switch (action.type) {
    case 'UPDATE_SPLIT_OPTIONS':
      const updatedSplits = state.map(split =>
        split.place === action.payload.place ? action.payload : split,
      );
      saveState({ ...state, splits: updatedSplits }); // Save updated state to AsyncStorage
      return updatedSplits;
    case 'RESET_SPLIT_OPTIONS_TO_DEFAULT':
      const defaultSplitOptionsPayload = action.payload;
      saveState({ ...state, splits: defaultSplitOptionsPayload });
      return defaultSplitOptionsPayload;
    default:
      return state;
  }
};

export const currencyConfigReducer = (
  state: CurrencyType | undefined,
  action: CurrencyConfigAction,
): CurrencyType | undefined => {
  switch (action.type) {
    case 'UPDATE_CURRENCY_SIGN':
      const updatedCurrencyConfig = action.payload;
      saveState({ currencyConfig: updatedCurrencyConfig }); // Save updated currency config to AsyncStorage
      return updatedCurrencyConfig;
    case 'RESET_CURRENCY_TO_SYSTEM':
      saveState({ currencyConfig: undefined }); // Reset to system default
      return undefined;
    default:
      return state;
  }
};

export const savedTipsReducer = (state: SavedTip[], action: SavedTipAction): SavedTip[] => {
  switch (action.type) {
    case 'SAVE_TIP':
      const newTips = [action.payload, ...state];
      saveState({ savedTips: newTips });
      return newTips;
    case 'DELETE_TIP':
      const filteredTips = state.filter(tip => tip.id !== action.payload);
      saveState({ savedTips: filteredTips });
      return filteredTips;
    case 'CLEAR_ALL_TIPS':
      saveState({ savedTips: [] });
      return [];
    default:
      return state;
  }
};

export const duplicatePreventionReducer = (
  state: number,
  action: DuplicatePreventionAction,
): number => {
  switch (action.type) {
    case 'UPDATE_DUPLICATE_PREVENTION_WINDOW':
      saveState({ duplicatePreventionWindow: action.payload });
      return action.payload;
    default:
      return state;
  }
};

export interface LanguageState {
  language: string | undefined;
  isRTL: boolean;
}

export const languageReducer = (
  state: LanguageState,
  action: LanguageAction,
): LanguageState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      const newLanguageState = {
        language: action.payload.language,
        isRTL: action.payload.isRTL,
      };
      saveState(newLanguageState);
      return newLanguageState;
    case 'RESET_LANGUAGE_TO_SYSTEM':
      saveState({ language: undefined, isRTL: false });
      return { language: undefined, isRTL: false };
    default:
      return state;
  }
};

export const splitConfigReducer = (
  state: ActiveSplitConfig | undefined,
  action: SplitConfigAction,
): ActiveSplitConfig | undefined => {
  switch (action.type) {
    case 'SET_ACTIVE_SPLIT_CONFIG':
      saveState({ activeSplitConfig: action.payload });
      return action.payload;
    case 'CLEAR_ACTIVE_SPLIT_CONFIG':
      saveState({ activeSplitConfig: undefined });
      return undefined;
    default:
      return state;
  }
};

export const savedSplitPresetsReducer = (
  state: SavedSplitPreset[],
  action: SavedSplitPresetAction,
): SavedSplitPreset[] => {
  switch (action.type) {
    case 'SAVE_SPLIT_PRESET':
      const afterSave = [action.payload, ...state];
      saveState({ savedSplitPresets: afterSave });
      return afterSave;
    case 'UPDATE_SPLIT_PRESET':
      const afterUpdate = state.map(preset =>
        preset.id === action.payload.id ? action.payload : preset,
      );
      saveState({ savedSplitPresets: afterUpdate });
      return afterUpdate;
    case 'DELETE_SPLIT_PRESET':
      const afterDelete = state.filter(preset => preset.id !== action.payload);
      saveState({ savedSplitPresets: afterDelete });
      return afterDelete;
    default:
      return state;
  }
};

// Function to save state to AsyncStorage
const saveState = async (
  partialState: Partial<{
    tips: TipOptionState[];
    splits: SplitOptionState[];
    currencyConfig: CurrencyType | undefined;
    savedTips: SavedTip[];
    duplicatePreventionWindow: number;
    language: string;
    isRTL: boolean;
    activeSplitConfig: ActiveSplitConfig | undefined;
    savedSplitPresets: SavedSplitPreset[];
  }>,
) => {
  try {
    const currentState = await AsyncStorage.getItem(Constants.APP_STATE_ASYNCSTORAGE_KEY);
    if (currentState) {
      const currentStateObject = JSON.parse(currentState) as {
        tips: TipOptionState[];
        splits: SplitOptionState[];
        currencyConfig: CurrencyType | undefined;
        savedTips: SavedTip[];
        duplicatePreventionWindow: number;
        language: string;
        isRTL: boolean;
        activeSplitConfig: ActiveSplitConfig | undefined;
        savedSplitPresets: SavedSplitPreset[];
      };
      const newState = { ...currentStateObject, ...partialState };
      await AsyncStorage.setItem(Constants.APP_STATE_ASYNCSTORAGE_KEY, JSON.stringify(newState));
    } else {
      // If no current state exists, save the partial state directly
      await AsyncStorage.setItem(
        Constants.APP_STATE_ASYNCSTORAGE_KEY,
        JSON.stringify(partialState),
      );
    }
  } catch (error) {
    console.error('Failed to save state to AsyncStorage', error);
  }
};
