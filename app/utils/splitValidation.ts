import { IndividualSplit } from '@/context/types';

export interface SplitValidationResult {
    status: 'complete' | 'under' | 'over';
    totalAllocatedPercentage: number;
    fixedTotal: number;
    percentageTotal: number;
    remainderCount: number;
    remainingPercentage: number;
}

/**
 * Pure function — no React dependency.
 * Determines whether a set of split allocations sums to 100% of overallTotal.
 *
 * Rules:
 * - Fixed amounts are converted to percentage of overallTotal before comparison.
 * - Remainder people absorb whatever is left; their presence makes "over" the only
 *   failure mode (under is always covered by the remainder slot).
 * - Tolerance of 0.01% is applied to avoid floating-point false negatives.
 */
export function validateSplitAllocations(
    people: IndividualSplit[],
    overallTotal: number,
): SplitValidationResult {
    let fixedTotal = 0;
    let percentageTotal = 0;
    let remainderCount = 0;

    people.forEach(person => {
        switch (person.allocationType) {
            case 'fixed':
                fixedTotal += person.value || 0;
                break;
            case 'percentage':
                percentageTotal += person.value || 0;
                break;
            case 'remainder':
                remainderCount++;
                break;
        }
    });

    const fixedPercentage = overallTotal > 0 ? (fixedTotal / overallTotal) * 100 : 0;
    const totalAllocatedPercentage = fixedPercentage + percentageTotal;
    const remainingPercentage = 100 - totalAllocatedPercentage;
    const tolerance = 0.01;

    let status: 'complete' | 'under' | 'over';
    if (remainderCount > 0) {
        status = totalAllocatedPercentage > 100 + tolerance ? 'over' : 'complete';
    } else {
        if (Math.abs(totalAllocatedPercentage - 100) <= tolerance) {
            status = 'complete';
        } else if (totalAllocatedPercentage < 100) {
            status = 'under';
        } else {
            status = 'over';
        }
    }

    return {
        status,
        totalAllocatedPercentage,
        fixedTotal,
        percentageTotal,
        remainderCount,
        remainingPercentage: Math.max(0, remainingPercentage),
    };
}
