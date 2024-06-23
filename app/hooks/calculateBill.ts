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
    UP = "UP",
    DOWN = "DOWN",
    NO = "NO"
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
}

// Function to truncate a number to a fixed number of decimal places without rounding
const toFixedWithoutRounding = (value: number, decimals: number): string => {
    const factor = Math.pow(10, decimals);
    const truncatedValue = Math.floor(value * factor) / factor;
    return truncatedValue.toFixed(decimals);
}

// Main function to calculate bill values
export const calculateBillValues = (
    tipPercentage: number,
    billAmount: number,
    numberOfPeople: number,
    roundingMethod: RoundingMethodType
): BillCalculationType => {
    // Validate inputs
    if (isNaN(billAmount) || isNaN(tipPercentage) || isNaN(numberOfPeople) || numberOfPeople <= 0) {
        return {
            perPerson: {
                total: "0.00",
                tip: "0.00",
                subtotal: "0.00"
            },
            overall: {
                total: "0.00",
                tip: "0.00",
                subtotal: "0.00"
            },
            disabledRoundingMethods: {
                UP: false,
                DOWN: false,
                NO: false
            }
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
        NO: false
    };

    return {
        perPerson: {
            total: toFixedWithoutRounding(roundedTotalPerPerson, 2),
            tip: toFixedWithoutRounding(roundedTipPerPerson, 2),
            subtotal: toFixedWithoutRounding(roundedSubtotalPerPerson, 2)
        },
        overall: {
            total: toFixedWithoutRounding(roundedOverallTotal, 2),
            tip: toFixedWithoutRounding(roundedOverallTip, 2),
            subtotal: toFixedWithoutRounding(roundedOverallSubtotal, 2)
        },
        disabledRoundingMethods
    };
};
