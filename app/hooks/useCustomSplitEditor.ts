import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSplitSession } from '@/context/AppContext';
import { IndividualSplit, SavedSplitPreset } from '@/context/types';
import { validateSplitAllocations } from '@/utils/splitValidation';
import { namedPeople } from '@/utils/splitFormatting';
import { Constants } from '@configs';
import { setActiveSplitConfig, clearActiveSplitConfig } from '@/context/actionCreators';
import { useCustomSplitPeople } from './useCustomSplitPeople';
import { useSplitPresets } from './useSplitPresets';

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
    const { state: sessionState, dispatch: sessionDispatch } = useSplitSession();

    // Delegate people management to sub-hook
    const {
        people,
        setPeople,
        handleUpdatePerson: updatePerson,
        handleRemovePerson: removePerson,
        handleAddPerson: addPerson,
    } = useCustomSplitPeople();

    // Delegate preset management to sub-hook
    const {
        savedPresets,
        activePresetId,
        isExpanded,
        isDeleteMode,
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
    } = useSplitPresets(people, setPeople);

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
        validationResult.status === 'complete' && people.length >= Constants.MIN_SPLIT_PEOPLE && overallTotal > 0;

    // ── Main split actions ───────────────────────────────────────────────────

    const save = useCallback(() => {
        if (!canSave) return;
        const named = namedPeople(people, t);
        sessionDispatch(setActiveSplitConfig({ type: 'custom', customSplits: named }));
    }, [canSave, people, t, sessionDispatch]);

    const clear = useCallback(() => {
        sessionDispatch(clearActiveSplitConfig());
    }, [sessionDispatch]);

    const isCustomSplitActive = sessionState.activeSplitConfig?.type === 'custom';

    // ── Return ───────────────────────────────────────────────────────────────

    return {
        people: {
            list: people,
            canAdd: people.length < Constants.MAX_SPLIT_PEOPLE,
            canRemove: people.length > Constants.MIN_SPLIT_PEOPLE,
        },
        presets: {
            savedPresets,
            activePresetId,
            isExpanded,
            isDeleteMode,
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

