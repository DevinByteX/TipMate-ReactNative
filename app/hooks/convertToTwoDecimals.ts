export const convertToTwoDecimalPoints = (input: string): string => {
    // Remove any non-numeric characters
    const numericValue = input.replace(/[^0-9]/g, '');

    // If the numeric value is empty, return an empty string
    if (numericValue === '') {
        return '';
    }

    // Convert the numeric value(type String) to a number and divide by 100
    const valueWithFloatingPoints = parseFloat(numericValue) / 100;

    // Format the valueWithFloatingPoints(type number) to two decimal points and return it as string(by using toFixed() method returns string)
    return valueWithFloatingPoints.toFixed(2);

}

export const acceptNumbersAndDecimals = (input: string): string => {
    // Remove all characters except digits and decimal points
    let formatted = input.replace(/[^\d.]/g, '');

    // Ensure only one decimal point is present
    const parts = formatted.split('.');
    formatted = parts[0] + (parts.length > 1 ? `.${parts.slice(1).join('')}` : '');

    // Remove leading zeros (except when the input starts with "0" and has no decimal point)
    if (!formatted.startsWith('0.') && formatted.length > 1) {
        formatted = formatted.replace(/^0+/, '');
    }

    // Ensure a leading zero if the input starts with a decimal point
    if (formatted.startsWith('.')) {
        formatted = '0' + formatted;
    }

    // Restrict to two decimal places
    if (parts[1]?.length > 2) {
        formatted = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }

    return formatted;
};
