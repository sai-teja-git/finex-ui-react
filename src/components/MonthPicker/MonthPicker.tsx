import { useEffect, useState } from "react";
import "./MonthPicker.scss";
import moment, { Moment } from "moment-timezone";

interface MonthPickerProps {
    id: string,
    value?: Moment | undefined,
    minDate?: Moment | undefined | null,
    maxDate?: Moment | undefined | null,
    disabledMonths?: Moment[],
    monthSelected?(...a_args: unknown[]): MonthItem
}

interface MonthItem {
    value: Moment,
    display: string,
    current: boolean,
    disabled: boolean,
    formattedValue: string
}

interface YearItem {
    value: number,
    display: string
}
interface YearRangeData {
    start: number,
    end: number,
    years: YearItem[]
}

export default function MonthPicker({
    id = "",
    value = undefined,
    minDate = undefined,
    maxDate = undefined,
    disabledMonths = [],
    monthSelected
}: MonthPickerProps) {

    const MONTH_FORMAT = "YYYY-MM";

    const currentDate = moment();
    const [selectedMonth, setSelectedMonth] = useState<Moment | undefined | null>(null);
    const [yearMonthData, setYearMonthData] = useState<MonthItem[]>([]);
    const [yearRangeData, setYearRangeData] = useState<YearRangeData>({ years: [], start: -1, end: -1 });
    const [disabledMonthStrings, setDisabledMonthStrings] = useState<string[]>([]);
    const [openYearPicker, setYearPickerFlagStatus] = useState(false);

    useEffect(() => {
        setSelectedMonth(value);
    }, [value])

    useEffect(() => {
        updateCurrentYearMonths()
    }, [selectedMonth])

    useEffect(() => {
        if (disabledMonths.length) {
            let stringsArr: string[] = []
            for (let item of disabledMonths) {
                stringsArr.push(item.format(MONTH_FORMAT))
            }
            setDisabledMonthStrings([...stringsArr])
        }
    }, [disabledMonths])

    useEffect(() => {
        if (minDate || maxDate) {
            updateCurrentYearMonths()
        }
    }, [minDate, maxDate])

    /**
     * This function checks if a given month should be disabled based on minimum and maximum date
     * constraints.
     * @param {Moment} currentValue - Moment object representing the current date
     * @returns The function `checkDisabledMonth` returns a boolean value - `true` if the current month
     * is disabled based on the `minDate` or `maxDate`, and `false` otherwise.
     */
    function checkDisabledMonth(currentValue: Moment): boolean {
        const CURRENT_FORMATTED_VALUE = currentValue.format(MONTH_FORMAT);
        if (minDate) {
            if (minDate.format(MONTH_FORMAT) > CURRENT_FORMATTED_VALUE) {
                return true;
            }
        }
        if (maxDate) {
            if (maxDate.format(MONTH_FORMAT) < CURRENT_FORMATTED_VALUE) {
                return true;
            }
        }
        return false;
    }

    /**
     * The function `checkYearDisabled` determines if a given year is disabled based on minimum and
     * maximum date constraints.
     * @param {number} current - The `current` parameter in the `checkYearDisabled` function represents
     * the year that needs to be checked for being disabled. The function checks if the `current` year
     * is within the range specified by `minDate` and `maxDate`, and returns `true` if the year is
     * disabled (
     * @returns The function `checkYearDisabled` returns a boolean value. It returns `true` if the
     * `current` year is less than the `minDate` year or greater than the `maxDate` year. Otherwise, it
     * returns `false`.
     */
    function checkYearDisabled(current: number): boolean {
        if (minDate && minDate.year()) {
            if (current < minDate.year()) {
                return true
            }
        }
        if (maxDate && maxDate.year()) {
            if (current > maxDate.year()) {
                return true
            }
        }
        return false
    }

    /**
     * This function checks if the arrow should be disabled based on the type ("min" or "max") and
     * certain conditions related to dates and year pickers.
     * @param {"min" | "max"} type - The `type` parameter in the `checkArrowDisabled` function is a
     * string literal type that can only have the values `"min"` or `"max"`. This parameter is used to
     * determine whether to check for the minimum date constraints or the maximum date constraints.
     * @returns The function `checkArrowDisabled` returns a boolean value. It returns `true` if the
     * conditions specified for the `type` parameter ("min" or "max") are met, and `false` otherwise.
     */
    function checkArrowDisabled(type: "min" | "max"): boolean {
        if (type === "min") {
            if (minDate) {
                if (openYearPicker) {
                    if (yearRangeData.start <= minDate.year()) {
                        return true
                    }
                } else {
                    if (minDate.format("YYYY") === (selectedMonth ? selectedMonth.format("YYYY") : currentDate.format("YYYY"))) {
                        return true
                    }
                }
            }
        } else if (type === "max") {
            if (maxDate) {
                if (openYearPicker) {
                    if (yearRangeData.end >= maxDate.year()) {
                        return true
                    }
                } else {
                    if (maxDate.format("YYYY") === (selectedMonth ? selectedMonth.format("YYYY") : currentDate.format("YYYY"))) {
                        return true
                    }
                }
            }
        }
        return false;
    }

    /**
     * The function `updateCurrentYearMonths` updates the year and month data based on the selected
     * month or current date.
     */
    function updateCurrentYearMonths() {
        let selected_year = selectedMonth ? selectedMonth.year() : currentDate.year();
        const last_digit_of_year = selected_year % 10;
        const year_range_start = selected_year - (last_digit_of_year) + (last_digit_of_year === 0 ? -9 : 1);
        let year_range_arr: YearItem[] = [];
        for (let i = 0; i < 10; i++) {
            year_range_arr.push({
                value: year_range_start + i,
                display: String(year_range_start + i)
            })
        }
        setYearRangeData({
            start: year_range_start,
            end: year_range_start + 9,
            years: year_range_arr
        })
        let month_array: MonthItem[] = [];
        for (let i = 0; i < 12; i++) {
            const current = moment({ year: selected_year, month: i, day: 1 })
            const formattedValue = current.format(MONTH_FORMAT);
            month_array.push({
                value: current,
                display: current.format("MMM"),
                current: moment().format(MONTH_FORMAT) === formattedValue,
                disabled: checkDisabledMonth(current),
                formattedValue
            })
        }
        setYearMonthData([...month_array])
    }

    /**
     * The function `updateArrowClick` updates the year range data or selected month based on the type
     * of arrow click.
     * @param {string} type - The `type` parameter in the `updateArrowClick` function is used to
     * determine whether the user clicked on the "previous" arrow or the "next" arrow in the UI. This
     * information is then used to update the year or month accordingly based on the arrow clicked.
     */
    function updateArrowClick(type: string) {
        if (openYearPicker) {
            const yearAdd = type === "previous" ? -10 : 10;
            let new_year_array = []
            for (let item of yearRangeData.years) {
                new_year_array.push({
                    value: item.value + yearAdd,
                    display: String(item.value + yearAdd)
                })
            }
            setYearRangeData({
                start: yearRangeData.start + yearAdd,
                end: yearRangeData.end + yearAdd,
                years: new_year_array
            })
        } else {
            const yearAdd = type === "previous" ? -1 : 1;
            if (selectedMonth) {
                const newValue = moment(selectedMonth).add({ years: yearAdd });
                setSelectedMonth(newValue)
            } else {
                const newValue = moment({ month: 0, days: 1 }).add({ years: yearAdd });
                setSelectedMonth(newValue)
            }
        }
    }

    /**
     * The function `clickOnMonth` triggers the `monthSelected` callback with the selected month item
     * and then closes the dropdown.
     * @param {MonthItem} selected - The `selected` parameter in the `clickOnMonth` function is a
     * `MonthItem` object that represents the month item that was clicked on.
     */
    function clickOnMonth(selected: MonthItem) {
        if (monthSelected) {
            monthSelected(selected)
        }
        closeDropdown()
    }

    /**
     * The function `clickOnYear` sets the selected month to January of the chosen year and hides the
     * year picker.
     * @param {number} selected - The `selected` parameter is a number representing the year that the
     * user has clicked on.
     */
    function clickOnYear(selected: number) {
        setSelectedMonth(moment({ year: selected, month: 0, day: 1 }))
        setYearPickerFlagStatus(false)
    }

    /**
     * The function `resetMonthSelected` sets the selected month value and updates the year picker flag
     * status.
     */
    function resetMonthSelected() {
        setSelectedMonth(value)
        setYearPickerFlagStatus(false)
    }

    /**
     * The function `closeDropdown` toggles the visibility of a dropdown element identified by its ID.
     */
    function closeDropdown() {
        const DROPDOWN_ID = `month-picker-` + id;
        $(`#${DROPDOWN_ID}`).dropdown("toggle")
    }

    /* The above code is a TypeScript React function that generates a template for rendering a list of
    month selection items. It uses the `yearMonthData` array to map over each element and generate a
    `<div>` element for each month. */
    function monthSelectionTemplate() {
        return <>
            {
                yearMonthData.map((e, i) => (
                    <div className={`picker-item month`} key={i}>
                        <div className={
                            `picker-value 
                                            ${e.formattedValue === value?.format(MONTH_FORMAT) ? "selected" : ""}
                                            ${e.current ? "current-period" : ""}
                                            ${(e.disabled || disabledMonthStrings.includes(e.formattedValue)) ? "disabled-block" : ""}
                                        `} onClick={() => clickOnMonth(e)}>
                            {e.display}
                        </div>
                    </div>
                ))
            }
        </>
    }

    /* The above code is a TypeScript React function that generates a template for selecting a year. It
    maps through an array of years (presumably obtained from `yearRangeData.years`) and creates a
    `div` element for each year. Each `div` element represents a selectable year and has a class of
    `picker-item year`. */
    function yearSelectionTemplate() {
        return <>
            {
                yearRangeData.years.map((e, i) => (
                    <div className={`picker-item year`} key={i}>
                        <div className={
                            `picker-value ${e.value === (selectedMonth ? selectedMonth.year() : currentDate.year()) ? "selected" : ""}
                            ${checkYearDisabled(e.value) ? "disabled-block" : ""}
                                        `} onClick={() => clickOnYear(e.value)}>
                            {e.display}
                        </div>
                    </div>
                ))
            }
        </>
    }

    return (
        <>
            <div className="dropdown">
                <a className="btn btn-secondary btn-sm dropdown-toggle" role="button" id={`month-picker-` + id} data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" onClick={resetMonthSelected}>
                    {
                        value ?
                            value.format("MMM, yyyy")
                            :
                            "Select Month"
                    }
                </a>
                <div className="dropdown-menu" role="menu">
                    <div className="picker-block">
                        <div className="picker-header">
                            <div className={`nav-arrow ${checkArrowDisabled("min") ? "disabled-block" : ""}`} onClick={() => updateArrowClick("previous")}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </div>
                            <div className={`parent-period ${openYearPicker ? "" : "nested"}`} onClick={() => !openYearPicker && setYearPickerFlagStatus(true)}>
                                {
                                    openYearPicker ?
                                        `${yearRangeData.start} - ${yearRangeData.end}`
                                        :
                                        (
                                            selectedMonth ?
                                                selectedMonth.format("YYYY")
                                                :
                                                currentDate.format("YYYY")
                                        )
                                }
                            </div>
                            <div className={`nav-arrow ${checkArrowDisabled("max") ? "disabled-block" : ""}`}
                                onClick={() => updateArrowClick("next")}>
                                <i className="fa-solid fa-chevron-right"></i>
                            </div>
                        </div>
                        <div className="picker-body">
                            {openYearPicker ? yearSelectionTemplate() : monthSelectionTemplate()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
