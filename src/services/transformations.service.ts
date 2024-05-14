/**
 * The `titleCase` function takes a string as input and returns the same string with the first letter
 * of each word capitalized.
 * @param {string} str - The `titleCase` function takes a string as input and converts it to title
 * case, where the first letter of each word is capitalized and the rest of the word is in lowercase.
 * @returns The `titleCase` function takes a string as input, converts it to lowercase, capitalizes the
 * first letter of each word, and returns the modified string. If an error occurs during the execution
 * of the function, it returns the original input string.
 */
const titleCase = (str: string) => {
    try {
        return str.toLowerCase().split(' ').map((word) => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ');
    } catch { }
    return str
}

const roundOff = (value: number, offset = 2) => {
    try {
        const values = String(value).split(".")
        return Number(`${values[0]}${values[1] ? "." + values[1].slice(0, offset) : ""}`)
    } catch { }
    return value
}

const transformationService = {
    titleCase,
    roundOff,
}

export default transformationService