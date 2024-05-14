/**
 * The function `generateRandom` generates a random number within a specified range.
 * @param {number} min - The `min` parameter represents the minimum value of the range from which you
 * want to generate a random number.
 * @param {number} max - The `max` parameter represents the maximum value that you want the random
 * number to be generated within.
 * @returns The function generates a random number between the `min` and `max` values (inclusive)
 * and returns it.
 */
const generateRandom = (min: number, max: number) => (Math.floor(Math.random() * (max - min + 1)) + min);

/**
 * The `formatCurrencyValue` function takes a value and a currency code, formats the value as currency
 * using the specified currency code, and returns the formatted value as a string.
 * @param {string | number} value - The `value` parameter can be either a string or a number
 * representing the numerical value that you want to format as a currency.
 * @param {string} currency_code - The `currency_code` parameter is a string that represents the
 * currency code used for formatting the value. It defaults to the value retrieved from the
 * `sessionStorage` with the key "currency_code". If no value is found in the `sessionStorage`, it
 * defaults to an empty string.
 * @returns The `formatCurrencyValue` function returns a formatted currency value as a string. If the
 * value provided is a valid number, it will format the number according to the specified currency code
 * and return the formatted value. If there is an error during the formatting process, it will return
 * the original value as a string.
 */
const formatCurrencyValue = (value: string | number, currency_code: string = sessionStorage.getItem("currency_code") as string): string => {
    try {
        const curr_value = Number(value)
        const formattedValue = new Intl.NumberFormat(`en-${currency_code.slice(0, 2)}`, {
            style: 'currency',
            currency: currency_code,
            minimumFractionDigits: curr_value % 1 === 0 ? 0 : 2,
        }).format(curr_value);
        return formattedValue
    } catch { }
    return String(value)
}

/**
 * The function checks if the input is valid by verifying that it is not null, undefined, or an
 * empty string.
 * @param {string | number | boolean | null | undefined | Object} input - The input parameter can
 * be of type string, number, boolean, null, undefined, or Object.
 * @returns a boolean value. It returns true if the input is not null, not undefined, and not an
 * empty string. Otherwise, it returns false.
 */
const inputValid = (input: string | number | boolean | null | undefined | Object): boolean => {
    if (input !== null && input !== undefined && input !== "") {
        return true;
    }
    return false
}

/**
 * The function filters an array of items based on a search text and specified item keys.
 * @param {any[]} items - An array of items that you want to filter based on the search text.
 * @param {string[]} item_keys - The `item_keys` parameter is an array of strings that represents
 * the keys of the items in the `items` array. These keys are used to access the corresponding
 * values in each item for filtering.
 * @param {string} [search_text] - The search_text parameter is a string that represents the text
 * to search for in the items array.
 * @returns an array of filtered items based on the search text.
 */
const filterArrayOnSearch = (items: any[], item_keys: string[], search_text: string = ""): any[] => {
    /**
     * The function `includeText` checks if a given text includes a specific search string,
     * regardless of case sensitivity.
     * @param {any} text - The `text` parameter is the input text that you want to search within.
     * @param {string} search - The `search` parameter is a string that represents the text you
     * want to search for within the `text` parameter.
     * @returns a boolean value. It returns true if the search string is found within the text
     * string (case-insensitive), and false otherwise.
     */
    let includeText = (text: any, search: string) => {
        try {
            if (!inputValid(search) || !inputValid(text)) {
                throw new Error("invalid text")
            }
            return String(text).toLowerCase().includes(search.toLowerCase())
        } catch { }
        return false;
    }
    try {
        if (!items) { return [] }
        if (!search_text) { return items; };
        search_text = search_text.trim()
        return items.filter(each_item => {
            try {
                if (typeof (each_item) !== "object") {
                    return includeText(each_item, search_text)
                }
                if (!item_keys || !(item_keys as string[]).length) {
                    item_keys = Object.keys(each_item)
                }
                for (const key_name of item_keys) {
                    if (includeText(each_item[key_name], search_text)) {
                        return true
                    }
                }
            } catch { }
            return false;
        })
    } catch { }
    return [];
}

/**
 * The function calculates the percentage of a value relative to a base value, with an optional
 * rounding off feature.
 * @param {number} value - The `value` parameter represents the numerical value for which you want to
 * calculate the percentage.
 * @param {number} base - The `base` parameter in the `calculatePercentage` function represents the
 * total value or the denominator that you want to calculate the percentage against.
 * @param {number} [roundOff] - The `roundOff` parameter in the `calculatePercentage` function is an
 * optional parameter that specifies the number of decimal places to round the calculated percentage
 * to. If provided, the calculated percentage will be rounded off to the specified number of decimal
 * places. If not provided, the calculated percentage will not be rounded
 * @returns The function `calculatePercentage` returns the calculated percentage value of `value` with
 * respect to `base`. If `roundOff` parameter is provided, the calculated percentage is rounded off to
 * the specified number of decimal places. If an error occurs (e.g., division by zero), the function
 * returns 0.
 */
const calculatePercentage = (value: number, base: number, roundOff?: number) => {
    try {
        if (base === 0) {
            throw new Error("invalid")
        }
        const calculated = (value / base) * 100
        return roundOff ? Number(calculated.toFixed(roundOff)) : calculated;
    } catch { }
    return 0
}

const helperService = {
    generateRandom,
    formatCurrencyValue,
    inputValid,
    filterArrayOnSearch,
    calculatePercentage
}
export default helperService