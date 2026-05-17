import { useState, useCallback, useEffect } from 'react';
import { useHistory, useSplitSession } from '@/context/AppContext';
import { IndividualSplit, SavedSplitPreset } from '@/context/types';

export const useSplitPresets = () => {
    const { state: historyState } = useHistory();
    const { state } = useSplitSession();

    const [activePresetId, setActivePresetId] = useState<string | null>(null);
    const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);
    const [isPresetDeleteMode, setIsPresetDeleteMode] = useState(false);

    // Check if the current activeSplitConfig matches any saved preset
    useEffect(() => {
        if (
            state.activeSplitConfig?.type === 'custom' &&
            state.activeSplitConfig?.customSplits &&
            historyState.savedSplitPresets.length > 0
        ) {
            const currentSplits = state.activeSplitConfig.customSplits;

            // Find a preset that matches the current config
            const matchingPreset = historyState.savedSplitPresets.find(preset => {
                if (preset.customSplits.length !== currentSplits.length) return false;

                return preset.customSplits.every((split, index) => {
                    const current = currentSplits[index];
                    return (
                        split.allocationType === current.allocationType &&
                        split.value === current.value &&
                        split.name === current.name
                    );
                });
            });

            if (matchingPreset) {
                setActivePresetId(matchingPreset.id);
            }
        }
    }, [state.activeSplitConfig, historyState.savedSplitPresets]);

    // Load a preset into the editor
    const handleLoadPreset = useCallback(
        (preset: SavedSplitPreset, onLoadPeople: (people: IndividualSplit[]) => void) => {
            if (isPresetDeleteMode) return;
            const loadedPeople = preset.customSplits.map(split => ({
                ...split,
                calculatedAmount: undefined,
            }));
            onLoadPeople(loadedPeople);
            setActivePresetId(preset.id);
        },
        [isPresetDeleteMode],
    );

    // Toggle preset selection: deselect if already active, load if not
    const handlePresetPress = useCallback(
        (preset: SavedSplitPreset, onLoadPeople: (people: IndividualSplit[]) => void) => {
            if (isPresetDeleteMode) return;
            if (activePresetId === preset.id) {
                // Deselect the preset
                setActivePresetId(null);
            } else {
                // Load the preset
                handleLoadPreset(preset, onLoadPeople);
            }
        },
        [activePresetId, isPresetDeleteMode, handleLoadPreset],
    );

    // Clear active preset and reset to blank state
    const handleClearPreset = useCallback(
        (onClearPeople: () => void) => {
            setActivePresetId(null);
            onClearPeople();
        },
        [],
    );

    // Handle long press on preset card — enter delete mode
    const handlePresetLongPress = useCallback(() => {
        setIsPresetDeleteMode(true);
    }, []);

    // Handle delete button press on a preset card
    const handlePresetDeletePress = useCallback((id: string) => {
        return id; // Return ID to be used in delete confirmation
    }, []);

    // Exit delete mode when all presets are deleted
    useEffect(() => {
        if (isPresetDeleteMode && historyState.savedSplitPresets.length === 0) {
            setIsPresetDeleteMode(false);
        }
    }, [historyState.savedSplitPresets.length, isPresetDeleteMode]);

    return {
        activePresetId,
        setActivePresetId,
        isPresetsExpanded,
        setIsPresetsExpanded,
        isPresetDeleteMode,
        setIsPresetDeleteMode,
        handleLoadPreset,
        handlePresetPress,
        handleClearPreset,
        handlePresetLongPress,
        handlePresetDeletePress,
    };
};
