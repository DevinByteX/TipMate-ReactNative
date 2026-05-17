import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useHistory, useSplitSession } from '@/context/AppContext';
import { IndividualSplit, SavedSplitPreset } from '@/context/types';
import { validateSplitAllocations } from '@/utils/splitValidation';
import { generateId } from '@/utils/idGenerator';
import { namedPeople } from '@/utils/splitFormatting';
import { findPresetDuplicate, getPresetSummary as getPresetSummaryFn } from '@/utils/presetManager';

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_PEOPLE = 2;
const MAX_PEOPLE = 15;

const createDefaultPerson = (): IndividualSplit => ({
    id: generateId(),
    name: '',
    allocationType: 'remainder',
    value: undefined,
    calculatedAmount: undefined,
});

// ─── Route Types ──────────────────────────────────────────────────────────────

type CustomSplitRouteParams = {
    CustomSplitScreen: {
        totalBill: number;
        tipPercentage: number;
        currencySymbol: string;
        presetId?: string;
    };
};

// ─── Return Shape ─────────────────────────────────────────────────────────────

export interface CustomSplitEditorReturn {
    people: {
        list: IndividualSplit[];
        canAdd: boolean;
        canRemove: boolean;
    };
    presets: {
        savedPresets: SavedSplitPreset[];
        activePresetId: string | null;
        isExpanded: boolean;
        isDeleteMode: boolean;
        isNameModalVisible: boolean;
        nameInput: string;
        isDeleteConfirmVisible: boolean;
        presetToDelete: string | null;
        duplicateAlert: { type: 'name' | 'config' | 'both'; preset: SavedSplitPreset } | null;
    };
    validation: {
        status: 'complete' | 'under' | 'over';
        overallTotal: number;
        totalAllocatedPercentage: number;
        fixedTotal: number;
        percentageTotal: number;
        remainderCount: number;
        remainingPercentage: number;
        canSave: boolean;
    };
    isCustomSplitActive: boolean;
    actions: {
        // People
        updatePerson: (id: string, updates: Partial<IndividualSplit>) => void;
        addPerson: () => void;
        removePerson: (id: string) => void;
        // Preset interaction
        loadPreset: (preset: SavedSplitPreset) => void;
        pressPreset: (preset: SavedSplitPreset) => void;
        longPressPreset: () => void;
        exitDeleteMode: () => void;
        togglePresetsExpanded: () => void;
        requestDeletePreset: (id: string) => void;
        cancelDeletePreset: () => void;
        confirmDeletePreset: () => void;
        // Preset save / name modal
        openSaveModal: () => void;
        closeSaveModal: () => void;
        setNameInput: (value: string) => void;
        savePreset: () => void;
        updatePreset: () => void;
        // Duplicate alert actions
        dismissDuplicateAlert: () => void;
        confirmDuplicateAndRename: () => void;
        loadPresetFromDuplicate: (preset: SavedSplitPreset) => void;
        // Main split actions (navigation stays in the screen)
        save: () => void;
        clear: () => void;
        // Utility
        getPresetSummary: (preset: SavedSplitPreset) => string;
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCustomSplitEditor = (
    totalBill: number,
    tipPercentage: number,
): CustomSplitEditorReturn => {
    const { t } = useTranslation();
    const { state: historyState, dispatch: historyDispatch } = useHistory();
    const { state: sessionState, dispatch: sessionDispatch } = useSplitSession();
    const route = useRoute<RouteProp<CustomSplitRouteParams, 'CustomSplitScreen'>>();
    const { presetId } = route.params || {};

    // ── People ──────────────────────────────────────────────────────────────

    const getInitialPeople = (): IndividualSplit[] => {
        if (presetId) {
            const preset = historyState.savedSplitPresets.find(p => p.id === presetId);
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
    const [hasLoadedPresetFromRoute, setHasLoadedPresetFromRoute] = useState(false);

    // Sync preset loading once persisted state is hydrated
    useEffect(() => {
        if (presetId && !hasLoadedPresetFromRoute && historyState.savedSplitPresets.length > 0) {
            const preset = historyState.savedSplitPresets.find(p => p.id === presetId);
            if (preset) {
                setPeople(preset.customSplits.map(split => ({ ...split, calculatedAmount: undefined })));
                setHasLoadedPresetFromRoute(true);
            }
        }
    }, [presetId, historyState.savedSplitPresets, hasLoadedPresetFromRoute]);

    // ── Preset display state ─────────────────────────────────────────────────

    const [activePresetId, setActivePresetId] = useState<string | null>(null);
    const [isPresetsExpanded, setIsPresetsExpanded] = useState(true);
    const [isPresetDeleteMode, setIsPresetDeleteMode] = useState(false);
    const [isNameModalVisible, setIsNameModalVisible] = useState(false);
    const [nameInput, setNameInputState] = useState('');
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<string | null>(null);
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

    // ── Validation ───────────────────────────────────────────────────────────

    const overallTotal = useMemo(() => {
        const tip = (tipPercentage / 100) * totalBill;
        return totalBill + tip;
    }, [totalBill, tipPercentage]);

    const validationResult = useMemo(
        () => validateSplitAllocations(people, overallTotal),
        [people, overallTotal],
    );

    const canSave =
        validationResult.status === 'complete' && people.length >= MIN_PEOPLE && overallTotal > 0;

    // ── Helpers ──────────────────────────────────────────────────────────────

    const findDuplicate = useCallback(
        (
            name: string,
            splits: IndividualSplit[],
        ): { type: 'name' | 'config' | 'both'; preset: SavedSplitPreset } | null =>
            findPresetDuplicate(name, splits, historyState.savedSplitPresets),
        [historyState.savedSplitPresets],
    );

    const getPresetSummary = useCallback(
        (preset: SavedSplitPreset): string => getPresetSummaryFn(preset, t),
        [t],
    );

    // ── People actions ───────────────────────────────────────────────────────

    const updatePerson = useCallback((id: string, updates: Partial<IndividualSplit>) => {
        setPeople(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    }, []);

    const addPerson = useCallback(() => {
        setPeople(prev => (prev.length >= MAX_PEOPLE ? prev : [...prev, createDefaultPerson()]));
    }, []);

    const removePerson = useCallback((id: string) => {
        setPeople(prev => (prev.length <= MIN_PEOPLE ? prev : prev.filter(p => p.id !== id)));
    }, []);

    // ── Preset interaction ───────────────────────────────────────────────────

    const loadPreset = useCallback(
        (preset: SavedSplitPreset) => {
            if (isPresetDeleteMode) return;
            setPeople(preset.customSplits.map(split => ({ ...split, calculatedAmount: undefined })));
            setActivePresetId(preset.id);
        },
        [isPresetDeleteMode],
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
        historyDispatch({ type: 'DELETE_SPLIT_PRESET', payload: presetToDelete });
        if (activePresetId === presetToDelete) setActivePresetId(null);
        setPresetToDelete(null);
        setIsDeleteConfirmVisible(false);
        Toast.show({ type: 'success', text1: t('screens.customSplit.presetDeleted') });
    }, [presetToDelete, activePresetId, historyDispatch, t]);

    // ── Preset save / name modal ─────────────────────────────────────────────

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
        historyDispatch({
            type: 'SAVE_SPLIT_PRESET',
            payload: {
                id: generateId(),
                name: trimmedName,
                createdAt: now,
                updatedAt: now,
                customSplits: named,
            },
        });
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
        historyDispatch({
            type: 'UPDATE_SPLIT_PRESET',
            payload: { ...existing, updatedAt: Date.now(), customSplits: named },
        });
        Toast.show({ type: 'success', text1: t('screens.customSplit.presetUpdated') });
    }, [activePresetId, historyState.savedSplitPresets, people, historyDispatch, t]);

    // ── Duplicate alert actions ──────────────────────────────────────────────

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

    // ── Main split actions ───────────────────────────────────────────────────

    const save = useCallback(() => {
        if (!canSave) return;
        const named = namedPeople(people, t);
        sessionDispatch({
            type: 'SET_ACTIVE_SPLIT_CONFIG',
            payload: { type: 'custom', customSplits: named },
        });
    }, [canSave, people, t, sessionDispatch]);

    const clear = useCallback(() => {
        sessionDispatch({ type: 'CLEAR_ACTIVE_SPLIT_CONFIG' });
    }, [sessionDispatch]);

    const isCustomSplitActive = sessionState.activeSplitConfig?.type === 'custom';

    // ── Return ───────────────────────────────────────────────────────────────

    return {
        people: {
            list: people,
            canAdd: people.length < MAX_PEOPLE,
            canRemove: people.length > MIN_PEOPLE,
        },
        presets: {
            savedPresets: historyState.savedSplitPresets,
            activePresetId,
            isExpanded: isPresetsExpanded,
            isDeleteMode: isPresetDeleteMode,
            isNameModalVisible,
            nameInput,
            isDeleteConfirmVisible,
            presetToDelete,
            duplicateAlert,
        },
        validation: {
            ...validationResult,
            overallTotal,
            canSave,
        },
        isCustomSplitActive,
        actions: {
            updatePerson,
            addPerson,
            removePerson,
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
            save,
            clear,
            getPresetSummary,
        },
    };
};
