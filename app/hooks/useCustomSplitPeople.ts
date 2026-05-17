import { useState, useCallback, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useHistory, useSplitSession } from '@/context/AppContext';
import { IndividualSplit } from '@/context/types';
import { generateId } from '@/utils/idGenerator';
import { Constants } from '@configs';
import type { RootStackParamList } from '@navigation/types';

const createDefaultPerson = (): IndividualSplit => ({
    id: generateId(),
    name: '',
    allocationType: 'remainder',
    value: undefined,
    calculatedAmount: undefined,
});

export const useCustomSplitPeople = () => {
    const { state } = useHistory();
    const { state: sessionState } = useSplitSession();
    const route = useRoute<RouteProp<RootStackParamList, 'CustomSplitScreen'>>();
    const { presetId } = route.params || {};

    const [hasLoadedPresetFromRoute, setHasLoadedPresetFromRoute] = useState(false);

    // Resolve initial people: route preset → active session config → 2 defaults
    const getInitialPeople = (): IndividualSplit[] => {
        if (presetId) {
            const preset = state.savedSplitPresets.find(p => p.id === presetId);
            if (preset) {
                return preset.customSplits.map(split => ({ ...split, calculatedAmount: undefined }));
            }
        }
        if (sessionState.activeSplitConfig?.type === 'custom' && sessionState.activeSplitConfig.customSplits) {
            return sessionState.activeSplitConfig.customSplits.map(split => ({ ...split, calculatedAmount: undefined }));
        }
        return [createDefaultPerson(), createDefaultPerson()];
    };

    const [people, setPeople] = useState<IndividualSplit[]>(getInitialPeople);

    // Sync preset loading when presets become available after async persist load
    useEffect(() => {
        if (presetId && !hasLoadedPresetFromRoute && state.savedSplitPresets.length > 0) {
            const preset = state.savedSplitPresets.find(p => p.id === presetId);
            if (preset) {
                setPeople(preset.customSplits.map(split => ({ ...split, calculatedAmount: undefined })));
                setHasLoadedPresetFromRoute(true);
            }
        }
    }, [presetId, state.savedSplitPresets, hasLoadedPresetFromRoute]);

    const handleUpdatePerson = useCallback((id: string, updates: Partial<IndividualSplit>) => {
        setPeople(prev => prev.map(person => (person.id === id ? { ...person, ...updates } : person)));
    }, []);

    const handleRemovePerson = useCallback((id: string) => {
        setPeople(prev => (prev.length <= Constants.MIN_SPLIT_PEOPLE ? prev : prev.filter(p => p.id !== id)));
    }, []);

    const handleAddPerson = useCallback(() => {
        setPeople(prev => (prev.length >= Constants.MAX_SPLIT_PEOPLE ? prev : [...prev, createDefaultPerson()]));
    }, []);

    return {
        people,
        setPeople,
        handleUpdatePerson,
        handleRemovePerson,
        handleAddPerson,
    };
};
