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

// Function to format and validate the input value
export const acceptNumbersAndDecimals = (input: string): string => {
    // Remove any non-numeric characters except the decimal point
    let formattedValue = input.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point is allowed
    const parts = formattedValue.split('.');
    if (parts.length > 2) {
        formattedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Ensure the value does not start with a decimal point
    if (formattedValue.startsWith('.')) {
        formattedValue = '0' + formattedValue;
    }

    return formattedValue;
};