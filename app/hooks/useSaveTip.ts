import { useCallback, useState } from 'react';
import { useHistory } from '../context/AppContext';
import { SavedTip, IndividualSplit } from '../context/types';
import { useNavigation } from '@react-navigation/native';
import { generateId } from '@/utils/idGenerator';
import { ActionTypes } from '@/context/actionTypes';

interface SaveTipParams {
    amount: number;
    tip: number;
    total: number;
    tipPercentage: number;
    numberOfPeople: number;
    splitType?: 'equal' | 'custom';
    perPerson?: {
        amount: number;
        tip: number;
        total: number;
    };
    individualSplits?: IndividualSplit[];
    currencySymbol: string;
    currencyCode: string;
}

export const useSaveTip = () => {
    const { dispatch } = useHistory();
    const navigation = useNavigation();

    const [saveSuccessAlert, setSaveSuccessAlert] = useState<{
        visible: boolean;
        savedTip?: SavedTip;
    }>({ visible: false });
    const [saveErrorAlert, setSaveErrorAlert] = useState(false);
    const [deleteErrorAlert, setDeleteErrorAlert] = useState(false);
    const [clearAllAlert, setClearAllAlert] = useState(false);
    const [clearErrorAlert, setClearErrorAlert] = useState(false);

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
                    splitType: params.splitType || 'equal',
                    perPerson: params.perPerson,
                    individualSplits: params.individualSplits,
                    currencySymbol: params.currencySymbol,
                    currencyCode: params.currencyCode,
                };

                dispatch({ type: ActionTypes.SAVE_TIP, payload: savedTip });
                setSaveSuccessAlert({ visible: true, savedTip });
                return savedTip;
            } catch (error) {
                console.error('Error saving tip:', error);
                setSaveErrorAlert(true);
                return null;
            }
        },
        [dispatch],
    );

    const deleteTip = useCallback(
        (tipId: string) => {
            try {
                dispatch({ type: ActionTypes.DELETE_TIP, payload: tipId });
            } catch (error) {
                console.error('Error deleting tip:', error);
                setDeleteErrorAlert(true);
            }
        },
        [dispatch],
    );

    const clearAllTips = useCallback(() => {
        setClearAllAlert(true);
    }, []);

    const confirmClearAllTips = useCallback(() => {
        try {
            dispatch({ type: ActionTypes.CLEAR_ALL_TIPS });
            setClearAllAlert(false);
        } catch (error) {
            console.error('Error clearing tips:', error);
            setClearErrorAlert(true);
        }
    }, [dispatch]);

    const navigateToTipDetail = useCallback(
        (tip: SavedTip) => {
            (navigation as any).navigate('SavedTipDetailScreen', { tip });
            setSaveSuccessAlert({ visible: false });
        },
        [navigation],
    );

    return {
        saveTip,
        deleteTip,
        clearAllTips,
        confirmClearAllTips,
        navigateToTipDetail,
        saveSuccessAlert,
        setSaveSuccessAlert,
        saveErrorAlert,
        setSaveErrorAlert,
        deleteErrorAlert,
        setDeleteErrorAlert,
        clearAllAlert,
        setClearAllAlert,
        clearErrorAlert,
        setClearErrorAlert,
    };
};
