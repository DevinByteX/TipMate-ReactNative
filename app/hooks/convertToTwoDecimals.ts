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
    if (parts.length > 2) {
        // If there are multiple decimal points, keep only the first
        formatted = parts[0] + '.' + parts.slice(1).join('');
    }

    // Remove leading zeros (except for decimal point)
    formatted = formatted.replace(/^0+(?!\d)/, '');

    // Ensure a leading zero if the input starts with a decimal point
    formatted = formatted.replace(/^(\.)/, '0$1');

    // Restrict to two decimal places
    if (parts[1]?.length > 2) {
        formatted = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }

    return formatted;
};
