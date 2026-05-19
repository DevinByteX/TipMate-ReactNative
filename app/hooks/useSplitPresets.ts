import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useHistory, useSplitSession } from '@/context/AppContext';
import { IndividualSplit, SavedSplitPreset } from '@/context/types';
import { generateId } from '@/utils/idGenerator';
import { namedPeople } from '@/utils/splitFormatting';
import { findPresetDuplicate, getPresetSummary as getPresetSummaryFn } from '@/utils/presetManager';
import { saveSplitPreset, updateSplitPreset, deleteSplitPreset } from '@/context/actionCreators';

export const useSplitPresets = (
    people: IndividualSplit[],
    setPeople: Dispatch<SetStateAction<IndividualSplit[]>>,
) => {
    const { t } = useTranslation();
    const { state: historyState, dispatch: historyDispatch } = useHistory();
    const { state: sessionState } = useSplitSession();

    // ── Display state ────────────────────────────────────────────────────────

    const [activePresetId, setActivePresetId] = useState<string | null>(null);
    const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);
    const [isPresetDeleteMode, setIsPresetDeleteMode] = useState(false);

    // ── Save modal state ─────────────────────────────────────────────────────

    const [isNameModalVisible, setIsNameModalVisible] = useState(false);
    const [nameInput, setNameInputState] = useState('');

    // ── Delete confirmation state ────────────────────────────────────────────

    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<string | null>(null);

    // ── Duplicate alert state ────────────────────────────────────────────────

    const [duplicateAlert, setDuplicateAlert] = useState<{
        type: 'name' | 'config' | 'both';
        preset: SavedSplitPreset;
    } | null>(null);

    // Detect if active session config matches a saved preset
    useEffect(() => {
        if (
            sessionState.activeSplitConfig?.type === 'custom' &&
            sessionState.activeSplitConfig?.customSplits &&
            historyState.savedSplitPresets.length > 0
        ) {
            const currentSplits = sessionState.activeSplitConfig.customSplits;
            const match = historyState.savedSplitPresets.find(preset => {
                if (preset.customSplits.length !== currentSplits.length) return false;
                return preset.customSplits.every((split, i) => {
                    const c = currentSplits[i];
                    return (
                        split.allocationType === c.allocationType &&
                        split.value === c.value &&
                        split.name === c.name
                    );
                });
            });
            if (match) setActivePresetId(match.id);
        }
    }, [sessionState.activeSplitConfig, historyState.savedSplitPresets]);

    // Exit delete mode when all presets are deleted
    useEffect(() => {
        if (isPresetDeleteMode && historyState.savedSplitPresets.length === 0) {
            setIsPresetDeleteMode(false);
        }
    }, [historyState.savedSplitPresets.length, isPresetDeleteMode]);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const findDuplicate = useCallback(
        (name: string, splits: IndividualSplit[]) =>
            findPresetDuplicate(name, splits, historyState.savedSplitPresets),
        [historyState.savedSplitPresets],
    );

    const getPresetSummary = useCallback(
        (preset: SavedSplitPreset): string => getPresetSummaryFn(preset, t),
        [t],
    );

    // ── Preset interaction ───────────────────────────────────────────────────

    const loadPreset = useCallback(
        (preset: SavedSplitPreset) => {
            if (isPresetDeleteMode) return;
            setPeople(preset.customSplits.map(split => ({ ...split, calculatedAmount: undefined })));
            setActivePresetId(preset.id);
        },
        [isPresetDeleteMode, setPeople],
    );

    const pressPreset = useCallback(
        (preset: SavedSplitPreset) => {
            if (isPresetDeleteMode) return;
            if (activePresetId === preset.id) {
                setActivePresetId(null);
            } else {
                loadPreset(preset);
            }
        },
        [activePresetId, isPresetDeleteMode, loadPreset],
    );

    const longPressPreset = useCallback(() => {
        setIsPresetDeleteMode(true);
    }, []);

    const exitDeleteMode = useCallback(() => {
        setIsPresetDeleteMode(false);
    }, []);

    const togglePresetsExpanded = useCallback(() => {
        setIsPresetsExpanded(prev => !prev);
    }, []);

    // ── Delete confirmation ──────────────────────────────────────────────────

    const requestDeletePreset = useCallback((id: string) => {
        setPresetToDelete(id);
        setIsDeleteConfirmVisible(true);
    }, []);

    const cancelDeletePreset = useCallback(() => {
        setIsDeleteConfirmVisible(false);
        setPresetToDelete(null);
    }, []);

    const confirmDeletePreset = useCallback(() => {
        if (!presetToDelete) return;
        historyDispatch(deleteSplitPreset(presetToDelete));
        if (activePresetId === presetToDelete) setActivePresetId(null);
        setPresetToDelete(null);
        setIsDeleteConfirmVisible(false);
        Toast.show({ type: 'success', text1: t('screens.customSplit.presetDeleted') });
    }, [presetToDelete, activePresetId, historyDispatch, t]);

    // ── Save modal ───────────────────────────────────────────────────────────

    const openSaveModal = useCallback(() => {
        setNameInputState('');
        setIsNameModalVisible(true);
    }, []);

    const closeSaveModal = useCallback(() => {
        setIsNameModalVisible(false);
        setNameInputState('');
    }, []);

    const setNameInput = useCallback((value: string) => {
        setNameInputState(value);
    }, []);

    const savePreset = useCallback(() => {
        const trimmedName = nameInput.trim();
        if (!trimmedName) {
            Toast.show({ type: 'error', text1: t('screens.customSplit.presetNameRequired') });
            return;
        }
        const named = namedPeople(people, t);
        const duplicate = findDuplicate(trimmedName, named);
        if (duplicate) {
            setIsNameModalVisible(false);
            setDuplicateAlert(duplicate);
            return;
        }
        const now = Date.now();
        historyDispatch(saveSplitPreset({
            id: generateId(),
            name: trimmedName,
            createdAt: now,
            updatedAt: now,
            customSplits: named,
        }));
        setIsNameModalVisible(false);
        setNameInputState('');
        setActivePresetId(null);
        Toast.show({ type: 'success', text1: t('screens.customSplit.presetSaved') });
    }, [nameInput, people, findDuplicate, historyDispatch, t]);

    const updatePreset = useCallback(() => {
        if (!activePresetId) return;
        const existing = historyState.savedSplitPresets.find(p => p.id === activePresetId);
        if (!existing) return;
        const named = namedPeople(people, t);
        historyDispatch(updateSplitPreset({ ...existing, updatedAt: Date.now(), customSplits: named }));
        Toast.show({ type: 'success', text1: t('screens.customSplit.presetUpdated') });
    }, [activePresetId, historyState.savedSplitPresets, people, historyDispatch, t]);

    // ── Duplicate alert ──────────────────────────────────────────────────────

    const dismissDuplicateAlert = useCallback(() => {
        setDuplicateAlert(null);
        setNameInputState('');
    }, []);

    const confirmDuplicateAndRename = useCallback(() => {
        setDuplicateAlert(null);
        setIsNameModalVisible(true);
    }, []);

    const loadPresetFromDuplicate = useCallback(
        (preset: SavedSplitPreset) => {
            loadPreset(preset);
            setDuplicateAlert(null);
            setNameInputState('');
        },
        [loadPreset],
    );

    return {
        savedPresets: historyState.savedSplitPresets,
        activePresetId,
        isExpanded: isPresetsExpanded,
        isDeleteMode: isPresetDeleteMode,
        isNameModalVisible,
        nameInput,
        isDeleteConfirmVisible,
        presetToDelete,
        duplicateAlert,
        loadPreset,
        pressPreset,
        longPressPreset,
        exitDeleteMode,
        togglePresetsExpanded,
        requestDeletePreset,
        cancelDeletePreset,
        confirmDeletePreset,
        openSaveModal,
        closeSaveModal,
        setNameInput,
        savePreset,
        updatePreset,
        dismissDuplicateAlert,
        confirmDuplicateAndRename,
        loadPresetFromDuplicate,
        getPresetSummary,
    };
};
