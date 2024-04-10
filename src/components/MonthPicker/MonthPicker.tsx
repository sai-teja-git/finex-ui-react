import { useEffect, useState } from "react";
import "./MonthPicker.scss";
import moment, { Moment } from "moment-timezone";

interface MonthPickerProps {
    id: string,
    value?: Moment | undefined,
    minDate?: Moment | undefined | null,
    maxDate?: Moment | undefined | null,
    disabledMonths?: Moment[]
}

interface MonthItem {
    value: Moment,
    display: string,
    current: boolean,
    disabled: boolean,
    formattedValue: string
}

export default function MonthPicker({
    id = "",
    value = undefined,
    minDate = undefined,
    maxDate = undefined,
    disabledMonths = []
}: MonthPickerProps) {

    const MONTH_FORMAT = "YYYY-MM";

    const currentDate = moment();
    const [selectedMonth, updateSelectedMonth] = useState<Moment | undefined | null>(null);
    const [yearMonthData, updateYearMonthData] = useState<MonthItem[]>([]);
    const [disabledMonthStrings, updateDisabledMonthStrings] = useState<string[]>([]);

    useEffect(() => {
        updateSelectedMonth(value);
        updateCurrentYearMonths()
    }, [value])

    useEffect(() => {
        if (disabledMonths.length) {
            let stringsArr: string[] = []
            for (let item of disabledMonths) {
                stringsArr.push(item.format(MONTH_FORMAT))
            }
            updateDisabledMonthStrings([...stringsArr])
        }
    }, [disabledMonths])

    useEffect(() => {
        if (minDate || maxDate) {
            updateCurrentYearMonths()
        }
    }, [minDate, maxDate, value])

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

    function updateCurrentYearMonths() {
        let selected_year = selectedMonth ? selectedMonth.year() : currentDate.year();
        console.log('selectedMonth?.format(', selected_year)
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
        console.log('month_array', month_array)
        updateYearMonthData([...month_array])
    }

    function resetMonthSelected() {
        updateSelectedMonth(value)
    }

    function closeDropdown() {
        const DROPDOWN_ID = `month-picker-` + id;
        $(`#${DROPDOWN_ID}`).dropdown("toggle")
    }

    function updateArrowClick(type: string) {
        const yearAdd = type === "previous" ? -1 : 1;
        if (selectedMonth) {
            const newValue = moment(selectedMonth).add({ years: yearAdd });
            updateSelectedMonth(newValue)
            updateCurrentYearMonths()
            console.log('newValue', newValue.format())
        } else {
            const newValue = moment({ month: 0, days: 1 }).add({ years: yearAdd });
            updateSelectedMonth(newValue)
            updateCurrentYearMonths()
            console.log('newValue', newValue.format())
        }
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
                            <div className="nav-arrow" onClick={() => updateArrowClick("previous")}>
                                <i className="fa-solid fa-chevron-left"></i>
                            </div>
                            <div className="parent-period nested">
                                {
                                    selectedMonth ?
                                        selectedMonth.format("YYYY")
                                        :
                                        currentDate.format("YYYY")
                                }
                            </div>
                            <div className={`nav-arrow ${(maxDate && maxDate.format("YYYY")) === (
                                selectedMonth ? selectedMonth.format("YYYY") : currentDate.format("YYYY")) ? "disabled-block" : ""}`}
                                onClick={() => updateArrowClick("next")}>
                                <i className="fa-solid fa-chevron-right"></i>
                            </div>
                        </div>
                        <div className="picker-body">
                            {
                                yearMonthData.map((e, i) => (
                                    <div className={`picker-item month`} key={i}>
                                        <div className={
                                            `picker-value 
                                            ${e.formattedValue === value?.format(MONTH_FORMAT) ? "selected" : ""}
                                            ${e.current ? "current-period" : ""}
                                            ${(e.disabled || disabledMonthStrings.includes(e.formattedValue)) ? "disabled-block" : ""}
                                        `}>
                                            {e.display}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
