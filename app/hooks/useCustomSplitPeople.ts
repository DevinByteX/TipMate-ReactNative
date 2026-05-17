import { useState, useCallback, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useHistory } from '@/context/AppContext';
import { IndividualSplit } from '@/context/types';
import { generateId } from '@/utils/idGenerator';
import { Constants } from '@configs';
import type { RootStackParamList } from '@navigation/types';

const createDefaultPerson = (index: number): IndividualSplit => ({
    id: generateId(),
    name: '',
    allocationType: 'remainder',
    value: undefined,
    calculatedAmount: undefined,
});

export const useCustomSplitPeople = () => {
    const { state } = useHistory();
    const route = useRoute<RouteProp<RootStackParamList, 'CustomSplitScreen'>>();
    const { presetId } = route.params || {};

    const [hasLoadedPresetFromRoute, setHasLoadedPresetFromRoute] = useState(false);

    // Resolve initial people from preset if presetId is provided
    const getInitialPeople = (): IndividualSplit[] => {
        if (presetId) {
            const preset = state.savedSplitPresets.find(p => p.id === presetId);
            if (preset) {
                return preset.customSplits.map(split => ({
                    ...split,
                    calculatedAmount: undefined,
                }));
            }
        }
        return [createDefaultPerson(0), createDefaultPerson(1)];
    };

    // Initialize with 2 default people or loaded preset
    const [people, setPeople] = useState<IndividualSplit[]>(getInitialPeople);

    // Sync preset loading when presets become available (after async persist load)
    useEffect(() => {
        if (presetId && !hasLoadedPresetFromRoute && state.savedSplitPresets.length > 0) {
            const preset = state.savedSplitPresets.find(p => p.id === presetId);
            if (preset) {
                const loadedPeople = preset.customSplits.map(split => ({
                    ...split,
                    calculatedAmount: undefined,
                }));
                setPeople(loadedPeople);
                setHasLoadedPresetFromRoute(true);
            }
        }
    }, [presetId, state.savedSplitPresets, hasLoadedPresetFromRoute]);

    const handleUpdatePerson = useCallback((id: string, updates: Partial<IndividualSplit>) => {
        setPeople(prev => prev.map(person => (person.id === id ? { ...person, ...updates } : person)));
    }, []);

    const handleRemovePerson = useCallback((id: string) => {
        setPeople(prev => {
            if (prev.length <= Constants.MIN_SPLIT_PEOPLE) return prev;
            return prev.filter(person => person.id !== id);
        });
    }, []);

    const handleAddPerson = useCallback(() => {
        setPeople(prev => {
            if (prev.length >= Constants.MAX_SPLIT_PEOPLE) return prev;
            return [...prev, createDefaultPerson(prev.length)];
        });
    }, []);

    return {
        people,
        setPeople,
        handleUpdatePerson,
        handleRemovePerson,
        handleAddPerson,
        hasLoadedPresetFromRoute,
        setHasLoadedPresetFromRoute,
        MIN_PEOPLE: Constants.MIN_SPLIT_PEOPLE,
        MAX_PEOPLE: Constants.MAX_SPLIT_PEOPLE,
        createDefaultPerson,
    };
};
