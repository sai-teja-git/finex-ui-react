const helperService = {

    /**
     * The function generates a random number within a specified range.
     * @param {number} min - The `min` parameter represents the minimum value of the range from which
     * you want to generate a random number.
     * @param {number} max - The `max` parameter represents the maximum value that you want the random
     * number to be generated within.
     * @returns The function generates a random number between the `min` and `max` values (inclusive)
     * and returns it.
     */
    generateRandom: (min: number, max: number) => (Math.floor(Math.random() * (max - min + 1)) + min),
    /**
     * takes two parameters: `value` which can be a string or a number, and `currency_code` which is a string representing
     * the currency code (e.g., "USD", "EUR").
     * @param value currency value
     * @param currency_code code of the currency
     * @returns converted currency value
     */
    formatCurrencyValue: (value: string | number, currency_code: string = sessionStorage.getItem("currency_code") as string): string => {
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

}
export default helperService;