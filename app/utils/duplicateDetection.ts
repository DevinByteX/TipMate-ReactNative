import type { IndividualSplit, SavedTip } from '@/context/types';

/**
 * Minimal shape of the current tip candidate being checked for duplicates.
 * Kept separate from `SavedTip` so the function stays decoupled from the
 * full saved-tip shape.
 */
export interface DuplicateCheckCandidate {
    amount: number;
    tip: number;
    total: number;
    tipPercentage: number;
    numberOfPeople: number;
    currencyCode: string;
    splitType: 'equal' | 'custom';
    /** Stable signature produced by `buildSplitSignature`. */
    splitSignature: string;
}

/**
 * Builds a stable, comparable string signature for a split configuration.
 *
 * Uses raw input values (id, allocationType, value) rather than calculated
 * amounts so that rounding-method changes don't produce false negatives.
 *
 * Returns `'equal'` for standard equal splits.
 */
export function buildSplitSignature(
    isCustomSplit: boolean,
    customSplits?: IndividualSplit[],
): string {
    if (!isCustomSplit || !customSplits || customSplits.length === 0) {
        return 'equal';
    }
    return `custom:${JSON.stringify(
        customSplits.map(s => ({ id: s.id, allocationType: s.allocationType, value: s.value })),
    )}`;
}

function areFloatsEqual(a: number, b: number, epsilon = 0.001): boolean {
    return Math.abs(a - b) < epsilon;
}

/**
 * Searches `savedTips` for a tip that matches `candidate` within the given
 * duplicate-prevention window. Returns the first match or `undefined`.
 *
 * Returns `undefined` immediately when `windowMinutes` is 0 (prevention
 * disabled) or when `savedTips` is empty.
 *
 * Matching criteria (all must hold):
 * - timestamp within window
 * - amount, tip, total within float epsilon (0.001)
 * - tipPercentage, numberOfPeople, currencyCode exact match
 * - splitType matches (treats missing `splitType` as 'equal')
 * - for custom splits: splitSignature must match
 */
export function findDuplicateTip(
    candidate: DuplicateCheckCandidate,
    savedTips: SavedTip[],
    windowMinutes: number,
): SavedTip | undefined {
    if (windowMinutes === 0 || savedTips.length === 0) {
        return undefined;
    }

    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    return savedTips.find(saved => {
        if (now - saved.timestamp >= windowMs) return false;
        if (!areFloatsEqual(saved.amount, candidate.amount)) return false;
        if (!areFloatsEqual(saved.tip, candidate.tip)) return false;
        if (!areFloatsEqual(saved.total, candidate.total)) return false;
        if (saved.tipPercentage !== candidate.tipPercentage) return false;
        if (saved.numberOfPeople !== candidate.numberOfPeople) return false;
        if (saved.currencyCode !== candidate.currencyCode) return false;
        if ((saved.splitType ?? 'equal') !== candidate.splitType) return false;
        if (candidate.splitType === 'custom') {
            return buildSplitSignature(true, saved.individualSplits) === candidate.splitSignature;
        }
        return true;
    });
}
