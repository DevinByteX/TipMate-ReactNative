import { SplitOptionState, SplitAction, TipOptionState, TipAction } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tipReducer = (state: TipOptionState[], action: TipAction): TipOptionState[] => {
    switch (action.type) {
        case 'UPDATE_TIP_OPTIONS':
            const updatedTips = state.map(tip =>
                tip.place === action.payload.place ? action.payload : tip
            );
            saveState({ ...state, tips: updatedTips }); // Save updated state to AsyncStorage
            return updatedTips;
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
        default:
            return state;
    }
};

// Function to save state to AsyncStorage
const saveState = async (partialState: Partial<{ tips: TipOptionState[], splits: SplitOptionState[] }>) => {
    try {
        const currentState = await AsyncStorage.getItem('appState');
        if (currentState) {
            const currentStateObject = JSON.parse(currentState) as { tips: TipOptionState[], splits: SplitOptionState[] };
            const newState = { ...currentStateObject, ...partialState };
            await AsyncStorage.setItem('appState', JSON.stringify(newState));
        }
    } catch (error) {
        console.error('Failed to save state to AsyncStorage', error);
    }
};
