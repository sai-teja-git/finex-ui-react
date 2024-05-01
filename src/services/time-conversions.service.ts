import moment from "moment-timezone";

/**
 * The function `removeTZFromDateString` removes the "T" and "Z" characters from a date string.
 * @param {string} date_string - A string representing a date and time in ISO 8601 format, such as
 * "2022-01-01T12:00:00Z".
 * @returns The function `removeTZFromDateString` takes a date string as input, replaces the "T" with a
 * space and removes the "Z" character, and then returns the modified date string.
 */
const removeTZFromDateString = (date_string: string): string => {
    date_string = date_string.replace("T", " ")
    date_string = date_string.replace("Z", "")
    return date_string
}

/**
 * The function `dateTimeFormat` takes a date, string, or number input and returns a formatted date and
 * time string.
 * @param {Date | string | number} date_time - The `date_time` parameter in the `dateTimeFormat`
 * function can be a `Date` object, a string representing a date and time, or a number representing a
 * timestamp.
 * @param [format=YYYY-MM-DD HH:mm:ss] - The `format` parameter in the `dateTimeFormat` function is a
 * string that specifies the format in which the date and time should be displayed. By default, it is
 * set to "YYYY-MM-DD HH:mm:ss", but you can provide a different format string according to your
 * requirements.
 * @returns The function `dateTimeFormat` returns a formatted date and time string based on the input
 * `date_time` and the specified format.
 */
const dateTimeFormat = (date_time: Date | string | number, format = "YYYY-MM-DD HH:mm:ss"): string => {
    if (typeof (date_time) === "string") {
        date_time = removeTZFromDateString(date_time)
    }
    date_time = new Date(date_time)
    return moment(date_time).format(format) as string
}

/**
 * The function `convertLocalDateTimeToUtc` converts a local date and time to UTC time based on the
 * provided time zone.
 * @param {Date | string | number} date_time - The `date_time` parameter in the
 * `convertLocalDateTimeToUtc` function can be of type `Date`, `string`, or `number`. It represents the
 * local date and time that you want to convert to UTC.
 * @param {string} [format] - The `format` parameter in the `convertLocalDateTimeToUtc` function is an
 * optional parameter that specifies the format in which the date and time should be returned. If
 * provided, the function will format the date and time according to the specified format before
 * returning it. If not provided, the function will
 * @param {string} time_zone - The `time_zone` parameter in the `convertLocalDateTimeToUtc` function
 * represents the time zone in which you want to convert the given local date and time to UTC. It is a
 * string parameter that specifies the time zone in the format accepted by moment-timezone library,
 * such as "America/New
 * @returns The function `convertLocalDateTimeToUtc` returns either a Date object or a string,
 * depending on the input and format specified. If a format is provided, the function returns the
 * formatted date as a string. If no format is provided, the function returns the refined UTC date as a
 * Date object.
 */
const convertLocalDateTimeToUtc = (date_time: Date | string | number, format?: string, time_zone: string = sessionStorage.getItem("time_zone") as string): Date | string => {
    if (typeof (date_time) === "string") {
        date_time = removeTZFromDateString(date_time)
    }
    date_time = dateTimeFormat(date_time);
    let refined_time_zone_date_time = new Date(moment.tz(date_time, "YYYY-MM-DD HH:mm:ss", time_zone).utc().format("YYYY-MM-DD HH:mm:ss"))
    if (format) {
        return dateTimeFormat(refined_time_zone_date_time, format)
    }
    return refined_time_zone_date_time
}

/**
 * The function `convertUtcDateTimeToLocal` converts a UTC date/time to a local date/time based on the
 * specified time zone and optional format.
 * @param {Date | string | number} date_time - The `date_time` parameter in the
 * `convertUtcDateTimeToLocal` function can be of type `Date`, `string`, or `number`. It represents the
 * date and time that you want to convert to a specific time zone.
 * @param {string} [format] - The `format` parameter in the `convertUtcDateTimeToLocal` function is an
 * optional parameter that specifies the format in which the date and time should be returned. It
 * allows you to customize the output format of the date and time. If provided, the function will
 * return the date and time in the specified
 * @param {string} time_zone - The `time_zone` parameter in the `convertUtcDateTimeToLocal` function
 * represents the time zone to which you want to convert the given UTC date and time. It is a string
 * parameter that specifies the target time zone for the conversion. The function uses this time zone
 * to convert the UTC date and time
 * @returns The function `convertUtcDateTimeToLocal` returns the converted local date and time based on
 * the input UTC date and time, with an optional specified format. If a format is provided, the
 * function returns the date and time in the specified format. If no format is provided, the function
 * returns the converted local date and time as a `Date` object.
 */
const convertUtcDateTimeToLocal = (date_time: Date | string | number, format?: string, time_zone: string = sessionStorage.getItem("time_zone") as string) => {
    date_time = dateTimeFormat(date_time)
    let refined_moment_date_time: Record<string, any> = moment(date_time).tz(time_zone)
    let refined_date_time = new Date(refined_moment_date_time["_d"])
    if (format) {
        return dateTimeFormat(refined_date_time, format)
    }
    return refined_date_time
}

const timeConversionsService = {
    removeTZFromDateString,
    dateTimeFormat,
    convertLocalDateTimeToUtc,
    convertUtcDateTimeToLocal
}
export default timeConversionsService