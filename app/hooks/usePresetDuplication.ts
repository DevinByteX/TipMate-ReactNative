import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useHistory } from '@/context/AppContext';
import { IndividualSplit, SavedSplitPreset } from '@/context/types';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const usePresetDuplication = () => {
    const { state, dispatch } = useHistory();

    const [isPresetNameModalVisible, setIsPresetNameModalVisible] = useState(false);
    const [presetNameInput, setPresetNameInput] = useState('');
    const [isDeletePresetVisible, setIsDeletePresetVisible] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
    const [duplicateAlert, setDuplicateAlert] = useState<{
        type: 'name' | 'config' | 'both';
        preset: SavedSplitPreset;
    } | null>(null);

    // Check for duplicate presets (name match, config match, or both)
    const findDuplicatePreset = useCallback(
        (
            name: string,
            splits: IndividualSplit[],
        ): { type: 'name' | 'config' | 'both'; preset: SavedSplitPreset } | null => {
            const lowerName = name.toLowerCase();

            const isSameConfig = (a: IndividualSplit[], b: IndividualSplit[]) => {
                if (a.length !== b.length) return false;
                return a.every(
                    (split, i) =>
                        split.allocationType === b[i].allocationType &&
                        split.value === b[i].value &&
                        split.name === b[i].name,
                );
            };

            for (const existing of state.savedSplitPresets) {
                const nameMatch = existing.name.toLowerCase() === lowerName;
                const configMatch = isSameConfig(splits, existing.customSplits);

                if (nameMatch && configMatch) return { type: 'both', preset: existing };
                if (nameMatch) return { type: 'name', preset: existing };
                if (configMatch) return { type: 'config', preset: existing };
            }

            return null;
        },
        [state.savedSplitPresets],
    );

    // Get named people (fills in default names for unnamed)
    const getNamedPeople = useCallback(
        (people: IndividualSplit[], t: (key: string, options?: any) => string) => {
            return people.map((person, index) => ({
                ...person,
                name: person.name.trim() || t('screens.customSplit.personDefault', { number: index + 1 }),
                calculatedAmount: undefined,
            }));
        },
        [],
    );

    // Save as new preset
    const handleSavePreset = useCallback(
        (
            people: IndividualSplit[],
            t: (key: string, options?: any) => string,
            onClose: () => void,
        ) => {
            const trimmedName = presetNameInput.trim();
            if (!trimmedName) return;

            const namedPeople = getNamedPeople(people, t);

            // Check for duplicates before saving
            const duplicate = findDuplicatePreset(trimmedName, namedPeople);
            if (duplicate) {
                setIsPresetNameModalVisible(false);
                setDuplicateAlert(duplicate);
                return;
            }

            const now = Date.now();

            const newPreset: SavedSplitPreset = {
                id: generateId(),
                name: trimmedName,
                createdAt: now,
                updatedAt: now,
                customSplits: namedPeople,
            };

            dispatch({ type: 'SAVE_SPLIT_PRESET', payload: newPreset });
            setIsPresetNameModalVisible(false);
            setPresetNameInput('');
            Toast.show({ type: 'success', text1: t('screens.customSplit.presetSaved') });
            onClose();
        },
        [presetNameInput, getNamedPeople, findDuplicatePreset, dispatch],
    );

    // Update existing preset
    const handleUpdatePreset = useCallback(
        (
            people: IndividualSplit[],
            activePresetId: string | null,
            t: (key: string, options?: any) => string,
        ) => {
            if (!activePresetId) return;

            const existingPreset = state.savedSplitPresets.find(p => p.id === activePresetId);
            if (!existingPreset) return;

            const namedPeople = getNamedPeople(people, t);

            const updatedPreset: SavedSplitPreset = {
                ...existingPreset,
                updatedAt: Date.now(),
                customSplits: namedPeople,
            };

            dispatch({ type: 'UPDATE_SPLIT_PRESET', payload: updatedPreset });
            Toast.show({ type: 'success', text1: t('screens.customSplit.presetUpdated') });
        },
        [state.savedSplitPresets, getNamedPeople, dispatch],
    );

    // Delete a preset
    const handleDeletePreset = useCallback(
        (t: (key: string, options?: any) => string, onDone?: () => void) => {
            if (!presetToDelete) return;
            // Check if this is the last preset before dispatching
            const remainingPresetsCount = state.savedSplitPresets.filter(
                p => p.id !== presetToDelete,
            ).length;
            dispatch({ type: 'DELETE_SPLIT_PRESET', payload: presetToDelete });
            setPresetToDelete(null);
            setIsDeletePresetVisible(false);
            Toast.show({ type: 'success', text1: t('screens.customSplit.presetDeleted') });
            if (onDone) onDone();
        },
        [presetToDelete, dispatch, state.savedSplitPresets],
    );

    return {
        isPresetNameModalVisible,
        setIsPresetNameModalVisible,
        presetNameInput,
        setPresetNameInput,
        isDeletePresetVisible,
        setIsDeletePresetVisible,
        presetToDelete,
        setPresetToDelete,
        duplicateAlert,
        setDuplicateAlert,
        findDuplicatePreset,
        getNamedPeople,
        handleSavePreset,
        handleUpdatePreset,
        handleDeletePreset,
    };
};
