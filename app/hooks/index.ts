const convertToTwoDecimalPoints = (number: number) => {
    // Ensure the input is a number
    if (typeof number !== 'number') {
        throw new TypeError('The input must be a number');
    }
    // Convert the number to a number with 2 decimal points after dividing by 100
    let result = (number / 100).toFixed(2);
    return result;
}

export { convertToTwoDecimalPoints };