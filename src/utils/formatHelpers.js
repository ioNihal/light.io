/**
 * Takes a string as parameter and format it to first letter caps and returns a new string
 * @param {string} str 
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}