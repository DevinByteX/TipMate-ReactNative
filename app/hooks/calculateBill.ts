import { toFixedWithoutRounding } from '@hooks';
import { IndividualSplit } from '@/context/types';

export type BillCalculationType = {
  perPerson: {
    total: string;
    tip: string;
    subtotal: string;
  };
  overall: {
    total: string;
    tip: string;
    subtotal: string;
  };
  disabledRoundingMethods: {
    UP: boolean;
    DOWN: boolean;
    NO: boolean;
  };
};

// Rounding method type
export type RoundingMethodType = 'UP' | 'DOWN' | 'NO';

// Disabled rounding methods type
export type DisabledRoundingMethodsType = {
  UP: boolean;
  DOWN: boolean;
  NO: boolean;
};

// Rounding method enum
export enum RoundingMethod {
  UP = 'UP',
  DOWN = 'DOWN',
  NO = 'NO',
}

// Rounding functions
const roundUp = (value: number): number => Math.ceil(value);
const roundDown = (value: number): number => Math.floor(value);
const noRound = (value: number): number => value;

// Function to apply rounding method
const applyRoundingMethod = (value: number, roundingMethod: RoundingMethodType): number => {
  switch (roundingMethod) {
    case RoundingMethod.UP:
      return roundUp(value);
    case RoundingMethod.DOWN:
      return roundDown(value);
    case RoundingMethod.NO:
      return noRound(value);
    default:
      throw new Error('Invalid Rounding Method');
  }
};

// Main function to calculate bill values
export const calculateBillValues = (
  tipPercentage: number,
  billAmount: number,
  numberOfPeople: number,
  roundingMethod: RoundingMethodType,
): BillCalculationType => {
  // Validate inputs
  if (isNaN(billAmount) || isNaN(tipPercentage) || isNaN(numberOfPeople) || numberOfPeople <= 0) {
    return {
      perPerson: {
        total: '0.00',
        tip: '0.00',
        subtotal: '0.00',
      },
      overall: {
        total: '0.00',
        tip: '0.00',
        subtotal: '0.00',
      },
      disabledRoundingMethods: {
        UP: false,
        DOWN: false,
        NO: false,
      },
    };
  }

  // Calculate the tip amount
  const tipTotal = (tipPercentage / 100) * billAmount;
  // Calculate the total bill including the tip
  const totalBill = billAmount + tipTotal;

  // Apply rounding methods
  const roundedOverallTip = applyRoundingMethod(tipTotal, roundingMethod);
  const roundedOverallSubtotal = applyRoundingMethod(billAmount, roundingMethod);
  const roundedOverallTotal = applyRoundingMethod(totalBill, roundingMethod);

  // Calculate per person values
  const roundedTipPerPerson = roundedOverallTip / numberOfPeople;
  const roundedSubtotalPerPerson = roundedOverallSubtotal / numberOfPeople;
  const roundedTotalPerPerson = roundedOverallTotal / numberOfPeople;

  // Determine disabled rounding methods
  const disabledRoundingMethods: DisabledRoundingMethodsType = {
    UP: totalBill === Math.ceil(totalBill),
    DOWN: totalBill === Math.floor(totalBill) || numberOfPeople === 1 || tipPercentage === 0,
    NO: false,
  };

  return {
    perPerson: {
      total: toFixedWithoutRounding(roundedTotalPerPerson, 2),
      tip: toFixedWithoutRounding(roundedTipPerPerson, 2),
      subtotal: toFixedWithoutRounding(roundedSubtotalPerPerson, 2),
    },
    overall: {
      total: toFixedWithoutRounding(roundedOverallTotal, 2),
      tip: toFixedWithoutRounding(roundedOverallTip, 2),
      subtotal: toFixedWithoutRounding(roundedOverallSubtotal, 2),
    },
    disabledRoundingMethods,
  };
};

// Custom split calculation result type
export type CustomSplitCalculationType = {
  overall: {
    total: string;
    tip: string;
    subtotal: string;
  };
  individuals: IndividualSplit[];
  disabledRoundingMethods: DisabledRoundingMethodsType;
};

// Calculate bill values with custom (unequal) split allocations
export const calculateBillValuesCustomSplit = (
  tipPercentage: number,
  billAmount: number,
  roundingMethod: RoundingMethodType,
  individualSplits: IndividualSplit[],
): CustomSplitCalculationType => {
  // Validate inputs
  if (isNaN(billAmount) || isNaN(tipPercentage) || billAmount < 0 || tipPercentage < 0 || individualSplits.length === 0) {
    return {
      overall: { total: '0.00', tip: '0.00', subtotal: '0.00' },
      individuals: [],
      disabledRoundingMethods: { UP: false, DOWN: false, NO: false },
    };
  }

  // 1. Calculate overall amounts
  const tipTotal = (tipPercentage / 100) * billAmount;
  const totalBill = billAmount + tipTotal;

  const roundedOverallTotal = applyRoundingMethod(totalBill, roundingMethod);
  const roundedOverallTip = applyRoundingMethod(tipTotal, roundingMethod);
  const roundedOverallSubtotal = applyRoundingMethod(billAmount, roundingMethod);

  // 2. Process allocations by type (Fixed → Percentage → Remainder)
  let remainingAmount = roundedOverallTotal;
  const processedSplits: (IndividualSplit & { decimalPart?: number })[] = [];

  // 2a. Process FIXED amounts first
  individualSplits
    .filter(s => s.allocationType === 'fixed')
    .forEach(split => {
      const amount = split.value || 0;
      remainingAmount -= amount;
      processedSplits.push({ ...split, calculatedAmount: amount });
    });

  // Guard: if fixed allocations exceed the total, clamp remainingAmount to 0
  // so that percentage and remainder splits don't receive negative amounts.
  if (remainingAmount < 0) {
    remainingAmount = 0;
  }

  // 2b. Process PERCENTAGE allocations second
  // Note: Percentages are calculated against the full rounded total (not the remaining
  // amount after fixed allocations). This matches the validation in CustomSplitScreen
  // where fixed_pct + percentage_pct are checked additively against 100%.
  individualSplits
    .filter(s => s.allocationType === 'percentage')
    .forEach(split => {
      const percentage = split.value || 0;
      const amount = (percentage / 100) * roundedOverallTotal;
      remainingAmount -= amount;
      processedSplits.push({ ...split, calculatedAmount: amount });
    });

  // 2c. Process REMAINDER splits (divide remaining equally)
  const remainderSplits = individualSplits.filter(s => s.allocationType === 'remainder');

  // If there are no remainder splits but there is still a significant remaining amount,
  // distribute it deterministically across existing percentage allocations so that
  // individuals add up to the overall total.
  if (remainderSplits.length === 0) {
    const unallocatedAmount = remainingAmount;
    const unallocatedInCents = Math.round(unallocatedAmount * 100);

    if (unallocatedInCents > 0) {
      const adjustableSplits = processedSplits.filter(
        split => split.allocationType === 'percentage',
      );

      const totalAdjustable = adjustableSplits.reduce(
        (sum, split) => sum + (split.calculatedAmount || 0),
        0,
      );

      if (totalAdjustable > 0) {
        adjustableSplits.forEach(split => {
          const current = split.calculatedAmount || 0;
          const proportion = current / totalAdjustable;
          split.calculatedAmount = current + unallocatedAmount * proportion;
        });
        remainingAmount = 0;
      }
    }
  }
  if (remainderSplits.length > 0) {
    const amountPerRemainder = remainingAmount / remainderSplits.length;
    remainderSplits.forEach(split => {
      processedSplits.push({ ...split, calculatedAmount: amountPerRemainder });
    });
  } else if (processedSplits.length > 0 && Math.abs(remainingAmount) > 0) {
    // If there are no remainder splits but some amount is still unallocated,
    // assign the remainder to the last processed split so totals stay consistent.
    const lastIndex = processedSplits.length - 1;
    const lastSplit = processedSplits[lastIndex];
    processedSplits[lastIndex] = {
      ...lastSplit,
      calculatedAmount: (lastSplit.calculatedAmount || 0) + remainingAmount,
    };
  }

  // 3. Distribute penny differences using largest decimal remainder method
  const splitsWithDecimals = processedSplits.map(split => ({
    ...split,
    decimalPart: Math.round((((split.calculatedAmount || 0) * 100) % 1) * 1e10) / 1e10,
  }));

  // Sort by decimal remainder descending for penny distribution
  splitsWithDecimals.sort((a, b) => (b.decimalPart || 0) - (a.decimalPart || 0));

  // Calculate total after flooring to cents
  const totalInCentsFloored = splitsWithDecimals.reduce(
    (sum, split) => sum + Math.floor((split.calculatedAmount || 0) * 100),
    0,
  );
  const targetInCents = Math.round(roundedOverallTotal * 100);
  const pennyDifference = targetInCents - totalInCentsFloored;

  // Add $0.01 to persons with largest decimal remainders
  for (let i = 0; i < pennyDifference && i < splitsWithDecimals.length; i++) {
    splitsWithDecimals[i].calculatedAmount =
      (Math.floor((splitsWithDecimals[i].calculatedAmount || 0) * 100) + 1) / 100;
  }
  // Floor the rest
  for (let i = pennyDifference; i < splitsWithDecimals.length; i++) {
    splitsWithDecimals[i].calculatedAmount =
      Math.floor((splitsWithDecimals[i].calculatedAmount || 0) * 100) / 100;
  }

  // 4. Determine disabled rounding methods
  const disabledRoundingMethods: DisabledRoundingMethodsType = {
    UP: totalBill === Math.ceil(totalBill),
    DOWN: totalBill === Math.floor(totalBill) || tipPercentage === 0,
    NO: false,
  };

  return {
    overall: {
      total: toFixedWithoutRounding(roundedOverallTotal, 2),
      tip: toFixedWithoutRounding(roundedOverallTip, 2),
      subtotal: toFixedWithoutRounding(roundedOverallSubtotal, 2),
    },
    individuals: splitsWithDecimals.map(({ decimalPart, ...split }) => ({
      id: split.id,
      name: split.name,
      allocationType: split.allocationType,
      value: split.value,
      calculatedAmount: split.calculatedAmount,
    })),
    disabledRoundingMethods,
  };
};
