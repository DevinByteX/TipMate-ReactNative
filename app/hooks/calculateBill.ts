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

export const calculateBillValues = (tipPercentage: number, billAmount: number, numberOfPeople: number): BillCalculationType => {
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

    console.log(`
    perPerson: {
        total: ${totalPerPerson},
        tip: ${tipPerPerson},
        subtotal: ${subtotalPerPerson}
        },
    overall: {
        total: ${totalBill},
        tip: ${tipTotal},
        subtotal: ${billAmount}
    }`);

    // Return the results
    return {
        perPerson: {
            total: totalPerPerson,
            tip: tipPerPerson,
            subtotal: subtotalPerPerson
        },
        overall: {
            total: totalBill,
            tip: tipTotal,
            subtotal: billAmount
        }
    };
};
