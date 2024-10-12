import { Constants, CurrencyType } from '@configs';
import { SplitOptionState, SplitAction, TipOptionState, TipAction, CurrencyConfigAction } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tipReducer = (state: TipOptionState[], action: TipAction): TipOptionState[] => {
    switch (action.type) {
        case 'UPDATE_TIP_OPTIONS':
            const updatedTips = state.map(tip =>
                tip.place === action.payload.place ? action.payload : tip
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

export const splitReducer = (state: SplitOptionState[], action: SplitAction): SplitOptionState[] => {
    switch (action.type) {
        case 'UPDATE_SPLIT_OPTIONS':
            const updatedSplits = state.map(split =>
                split.place === action.payload.place ? action.payload : split
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

export const currencyConfigReducer = (state: CurrencyType, action: CurrencyConfigAction): CurrencyType => {
    switch (action.type) {
        case 'UPDATE_CURRENCY_SIGN':
            const updatedCurrencyConfig = action.payload;
            saveState({ currencyConfig: updatedCurrencyConfig }); // Save updated currency config to AsyncStorage
            return updatedCurrencyConfig;
        default:
            return state;
    }
};

// Function to save state to AsyncStorage
const saveState = async (partialState: Partial<{ tips: TipOptionState[], splits: SplitOptionState[], currencyConfig: CurrencyType }>) => {
    try {
        const currentState = await AsyncStorage.getItem(Constants.APP_STATE_ASYNCSTORAGE_KEY);
        if (currentState) {
            const currentStateObject = JSON.parse(currentState) as { tips: TipOptionState[], splits: SplitOptionState[], currencyConfig: CurrencyType };
            const newState = { ...currentStateObject, ...partialState };
            await AsyncStorage.setItem(Constants.APP_STATE_ASYNCSTORAGE_KEY, JSON.stringify(newState));
        } else {
            // If no current state exists, save the partial state directly
            await AsyncStorage.setItem(Constants.APP_STATE_ASYNCSTORAGE_KEY, JSON.stringify(partialState));
        }
    } catch (error) {
        console.error('Failed to save state to AsyncStorage', error);
    }
};
