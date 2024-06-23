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
    disabledRoundingMethods: {
        UP: boolean;
        DOWN: boolean;
        NO: boolean;
    };
};

// Rounding method type
export type RoundingMethodType = 'UP' | 'DOWN' | 'NO';

// DisabledRounding methods type
export type DisabledRoundingMethodsType = {
    UP: boolean;
    DOWN: boolean;
    NO: boolean;
};


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
            },
            disabledRoundingMethods: {
                UP: false,
                DOWN: false,
                NO: false
            }
        };
    }

    // Calculate the tip amount
    const tipTotal = ((tipPercentage / 100) * billAmount)

    // Calculate the total bill including the tip
    const totalBill = (billAmount + tipTotal)

    // Calculate the subtotal per person (without tip)
    const subtotalPerPerson = (billAmount / numberOfPeople)

    // Calculate the tip per person
    const tipPerPerson = (tipTotal / numberOfPeople)

    // Calculate the total per person (including tip)
    const totalPerPerson = (totalBill / numberOfPeople)

    // Determine which rounding methods to disable
    const disabledRoundingMethods = {
        UP: false,
        DOWN: false,
        NO: false
    };

    if (numberOfPeople === 1 || tipPercentage === 0) {
        disabledRoundingMethods.DOWN = true;
    }

    if ((totalPerPerson === Math.floor(totalPerPerson)) && (totalBill === Math.floor(totalBill))) {
        disabledRoundingMethods.UP = true;
        disabledRoundingMethods.DOWN = true;
    }

    // Apply rounding method
    const roundedTotalPerPerson = applyRoundingMethod(totalPerPerson, roundingMethod);
    const roundedTipPerPerson = applyRoundingMethod(tipPerPerson, roundingMethod);
    const roundedSubtotalPerPerson = applyRoundingMethod(subtotalPerPerson, roundingMethod);

    // Calculate the total cost based on rounded values
    const roundedOverallTotal = roundedTotalPerPerson * numberOfPeople;
    const roundedOverallTip = roundedTipPerPerson * numberOfPeople;
    const roundedOverallSubtotal = roundedSubtotalPerPerson * numberOfPeople;

    // Return the results
    return {
        perPerson: {
            total: roundedTotalPerPerson,
            tip: roundedTipPerPerson,
            subtotal: roundedSubtotalPerPerson
        },
        overall: {
            total: roundedOverallTotal,
            tip: roundedOverallTip,
            subtotal: roundedOverallSubtotal
        },
        disabledRoundingMethods
    };
};
