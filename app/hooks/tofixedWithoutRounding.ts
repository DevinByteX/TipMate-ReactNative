/**
 * Converts a number to a string with a fixed number of decimal places
 * without rounding the result.
 * 
 * @param {number} value - The number to truncate.
 * @param {number} decimals - Number of decimal places to keep.
 * @returns {string} A string representation of the truncated number.
 */
export const toFixedWithoutRounding = (value: number, decimals: number): string => {
    // Calculate the factor by which to multiply the value to truncate decimals
    const factor = Math.pow(10, decimals);

    // Truncate the value by flooring the multiplied result and dividing by the factor
    const truncatedValue = Math.floor(value * factor) / factor;

    // Convert the truncated value to a string with the specified number of decimals
    return truncatedValue.toFixed(decimals);
}
