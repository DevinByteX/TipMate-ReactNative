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