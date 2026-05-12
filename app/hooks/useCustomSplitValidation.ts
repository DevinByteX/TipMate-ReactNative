import { useMemo } from 'react';
import { IndividualSplit } from '@/context/types';
import { toFixedWithoutRounding } from '@hooks';

export const useCustomSplitValidation = (
    people: IndividualSplit[],
    totalBill: number,
    tipPercentage: number,
    theme: any,
    t: (key: string, options?: any) => string,
) => {
    // Calculate overall total (bill + tip)
    const overallTotal = useMemo(() => {
        const tip = (tipPercentage / 100) * totalBill;
        return totalBill + tip;
    }, [totalBill, tipPercentage]);

    // Validation computation
    const validation = useMemo(() => {
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

        // Convert fixed to percentage of overallTotal for unified comparison
        const fixedPercentage = overallTotal > 0 ? (fixedTotal / overallTotal) * 100 : 0;
        const totalAllocatedPercentage = fixedPercentage + percentageTotal;

        // Remainder people get the leftover
        const remainingPercentage = 100 - totalAllocatedPercentage;

        // Determine status
        let status: 'complete' | 'under' | 'over';
        const tolerance = 0.01;

        if (remainderCount > 0) {
            // With remainder people, they absorb the leftover
            if (totalAllocatedPercentage > 100 + tolerance) {
                status = 'over';
            } else if (remainingPercentage < -tolerance) {
                status = 'over';
            } else {
                status = 'complete';
            }
        } else {
            // No remainder people — must sum to exactly 100%
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
    }, [people, overallTotal]);

    const canSave =
        validation.status === 'complete' && people.length >= 2 && overallTotal > 0;

    // Validation status display
    const getValidationIcon = () => {
        switch (validation.status) {
            case 'complete':
                return { name: 'check-circle' as const, color: theme.colors.success };
            case 'under':
                return { name: 'alert-circle' as const, color: theme.colors.error_toast };
            case 'over':
                return { name: 'alert' as const, color: theme.colors.warning };
        }
    };

    const getValidationText = () => {
        switch (validation.status) {
            case 'complete':
                return t('screens.customSplit.validationComplete');
            case 'under': {
                const remaining = toFixedWithoutRounding(100 - validation.totalAllocatedPercentage, 1);
                return t('screens.customSplit.validationUnder', { remaining: `${remaining}%` });
            }
            case 'over': {
                const excess = toFixedWithoutRounding(validation.totalAllocatedPercentage - 100, 1);
                return t('screens.customSplit.validationOver', { excess: `${excess}%` });
            }
        }
    };

    return {
        overallTotal,
        validation,
        canSave,
        getValidationIcon,
        getValidationText,
    };
};
