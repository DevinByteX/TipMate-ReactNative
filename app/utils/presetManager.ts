import { IndividualSplit, SavedSplitPreset } from '@/context/types';

export const isSameConfig = (a: IndividualSplit[], b: IndividualSplit[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every(
        (split, i) =>
            split.allocationType === b[i].allocationType &&
            split.value === b[i].value &&
            split.name === b[i].name,
    );
};

export const findPresetDuplicate = (
    name: string,
    splits: IndividualSplit[],
    savedPresets: SavedSplitPreset[],
): { type: 'name' | 'config' | 'both'; preset: SavedSplitPreset } | null => {
    const lowerName = name.toLowerCase();
    for (const existing of savedPresets) {
        const nameMatch = existing.name.toLowerCase() === lowerName;
        const configMatch = isSameConfig(splits, existing.customSplits);
        if (nameMatch && configMatch) return { type: 'both', preset: existing };
        if (nameMatch) return { type: 'name', preset: existing };
        if (configMatch) return { type: 'config', preset: existing };
    }
    return null;
};

export const getPresetSummary = (
    preset: SavedSplitPreset,
    t: (key: string) => string,
): string => {
    const counts = { fixed: 0, percentage: 0, remainder: 0 };
    preset.customSplits.forEach(s => {
        counts[s.allocationType]++;
    });
    const parts: string[] = [];
    if (counts.fixed > 0) parts.push(`${counts.fixed} ${t('screens.customSplit.fixed')}`);
    if (counts.percentage > 0) parts.push(`${counts.percentage} %`);
    if (counts.remainder > 0)
        parts.push(`${counts.remainder} ${t('screens.customSplit.remainder')}`);
    return parts.join(', ');
};
