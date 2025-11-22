import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { SavedTip } from '../context/types';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SaveTipParams {
    amount: number;
    tip: number;
    total: number;
    tipPercentage: number;
    numberOfPeople: number;
    perPerson?: {
        amount: number;
        tip: number;
        total: number;
    };
    currencySymbol: string;
    currencyCode: string;
}

// Simple ID generator using timestamp and random number
const generateId = (): string => {
    return `tip_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export const useSaveTip = () => {
    const { dispatch } = useAppContext();
    const navigation = useNavigation();

    const saveTip = useCallback(
        (params: SaveTipParams) => {
            try {
                const savedTip: SavedTip = {
                    id: generateId(),
                    timestamp: Date.now(),
                    amount: params.amount,
                    tip: params.tip,
                    total: params.total,
                    tipPercentage: params.tipPercentage,
                    numberOfPeople: params.numberOfPeople,
                    perPerson: params.perPerson,
                    currencySymbol: params.currencySymbol,
                    currencyCode: params.currencyCode,
                };

                dispatch({ type: 'SAVE_TIP', payload: savedTip });

                Alert.alert('Success', 'Tip calculation saved successfully!', [
                    { text: 'OK', style: 'cancel' },
                    {
                        text: 'View Details',
                        onPress: () => {
                            (navigation as any).navigate('SavedTipDetailScreen', { tip: savedTip });
                        },
                    },
                ]);
            } catch (error) {
                console.error('Error saving tip:', error);
                Alert.alert('Error', 'Failed to save tip calculation. Please try again.', [
                    { text: 'OK' },
                ]);
            }
        },
        [dispatch, navigation],
    );

    const deleteTip = useCallback(
        (tipId: string) => {
            try {
                dispatch({ type: 'DELETE_TIP', payload: tipId });
            } catch (error) {
                console.error('Error deleting tip:', error);
                Alert.alert('Error', 'Failed to delete tip. Please try again.', [{ text: 'OK' }]);
            }
        },
        [dispatch],
    );

    const clearAllTips = useCallback(() => {
        Alert.alert(
            'Clear All Tips',
            'Are you sure you want to delete all saved tips? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            dispatch({ type: 'CLEAR_ALL_TIPS' });
                        } catch (error) {
                            console.error('Error clearing tips:', error);
                            Alert.alert('Error', 'Failed to clear tips. Please try again.', [{ text: 'OK' }]);
                        }
                    },
                },
            ],
        );
    }, [dispatch]);

    return { saveTip, deleteTip, clearAllTips };
};
