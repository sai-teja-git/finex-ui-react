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

}
export default helperService