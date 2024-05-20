export type BillCalculationType = {
    perPerson: {
        total: number;
        tip: number;
        subtotal: number;
    };
    overall: {
        total: number;
        tip: number;
        subtotal: number;
    };
};

// Rounding method type
export type RoundingMethodType = 'UP' | 'DOWN' | 'NO';

// Rounding method enum
export enum RoundingMethod {
    UP = "UP",
    DOWN = "DOWN",
    NO = "NO"
}

const roundUp = (value: number): number => {
    return Math.ceil(value);
}

const roundDown = (value: number): number => {
    return Math.floor(value);
}

const noRound = (value: number): number => {
    return value;
}

// Function to apply rounding method
const applyRoundingMethod = (value: number, roundingMethod: RoundingMethodType): number => {
    switch (roundingMethod) {
        case 'UP':
            return roundUp(value);
        case 'DOWN':
            return roundDown(value);
        case 'NO':
            return noRound(value);
        default:
            throw new Error('Invalid Rounding Method');
    }
}

export const calculateBillValues = (tipPercentage: number, billAmount: number, numberOfPeople: number, roundingMethod: RoundingMethodType): BillCalculationType => {
     // Check if billAmount is a valid number
     if (isNaN(billAmount) || typeof billAmount !== 'number') {
        return {
            perPerson: {
                total: 0,
                tip: 0,
                subtotal: 0
            },
            overall: {
                total: 0,
                tip: 0,
                subtotal: 0
            }
        };
    }

    // Calculate the tip amount
    const tipTotal = parseFloat(((tipPercentage / 100) * billAmount).toFixed(2));

    // Calculate the total bill including the tip
    const totalBill = parseFloat((billAmount + tipTotal).toFixed(2));

    // Calculate the subtotal per person (without tip)
    const subtotalPerPerson = parseFloat((billAmount / numberOfPeople).toFixed(2));

    // Calculate the tip per person
    const tipPerPerson = parseFloat((tipTotal / numberOfPeople).toFixed(2));

    // Calculate the total per person (including tip)
    const totalPerPerson = parseFloat((totalBill / numberOfPeople).toFixed(2));

    // Apply rounding method
    const roundedTotalPerPerson = applyRoundingMethod(totalPerPerson, roundingMethod);
    const roundedTipPerPerson = applyRoundingMethod(tipPerPerson, roundingMethod);
    const roundedSubtotalPerPerson = applyRoundingMethod(subtotalPerPerson, roundingMethod);
    const roundedTotalBill = applyRoundingMethod(totalBill, roundingMethod);
    const roundedTipTotal = applyRoundingMethod(tipTotal, roundingMethod);

    // Return the results
    return {
        perPerson: {
            total: roundedTotalPerPerson,
            tip: roundedTipPerPerson,
            subtotal: roundedSubtotalPerPerson
        },
        overall: {
            total: roundedTotalBill,
            tip: roundedTipTotal,
            subtotal: billAmount
        }
    };
};
