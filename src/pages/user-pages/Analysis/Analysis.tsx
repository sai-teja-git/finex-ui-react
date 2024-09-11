import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accessibility from "highcharts/modules/accessibility";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import catagoriesApiService from "../../../api/categories.api.service";
import transactionLogApiService from "../../../api/transaction-log.api.service";
import Currency from "../../../components/Currency";
import MonthPicker from "../../../components/MonthPicker/MonthPicker";
import NoData from "../../../components/NoData";
import helperService from "../../../services/helper-functions.service";
import timeConversionsService from "../../../services/time-conversions.service";
import transformationService from "../../../services/transformations.service";
import "./Analysis.scss";
Accessibility(Highcharts);

export default function Analysis() {

    const transactionsType: any[] = [
        { key: "spend", name: "Spend", plural: "Spends", dbKey: "debit", dbKeyPleural: "debits" },
        { key: "estimation", name: "Estimation", plural: "Estimations", dbKey: "estimation", dbKeyPleural: "estimations" },
        { key: "income", name: "Income", plural: "Income", dbKey: "credit", dbKeyPleural: "credits" },
    ];
    const [transactionType, updateTransactionType] = useState<any>(transactionsType[0]);
    const [selectedMonth, updateAnalysisMonth] = useState(moment());
    const [categoriesObject, updateCategoriesObject] = useState<any>({});
    const [loadOverallData, updateOverallLoaderFlag] = useState(true);
    const [overallCardData, updateOverallCardData] = useState<Record<string, any>>({});
    const [validLineChart, updateLineChartStatus] = useState(false)
    const [monthSpendChart, updateMonthSpendChart] = useState({});
    const [loadCategoryData, updateCategoryLoadFlag] = useState(true);
    const [allCategoryValue, updateAllCategoryValue] = useState<Record<string, any>>({});
    const [categoryTableData, updateCategoryTableData] = useState<any[]>([]);
    const [categoryWisePie, updateCategoryWisePie] = useState({});
    const [validCategoryPie, updateCategoryPieStatus] = useState(false);
    const [spendCategories, updateSpendCategories] = useState<any[]>([]);
    const [incomeCategories, updateIncomeCategories] = useState<any[]>([]);
    const [selectedSingleCategory, updateSingleCategory] = useState<any>(null);
    const [loadSingleCategoryLog, updateSingleCategoryLogLoader] = useState(true);
    const [singleCatLogData, updateSingleCatLogData] = useState<any[]>([])

    useEffect(() => {
        getDefaultData()
    }, [selectedMonth])

    async function getDefaultData() {
        await getUserCatagories();
        getUserTransactions()
    }

    async function getUserCatagories() {
        try {
            if (Object.keys(categoriesObject).length) {
                getCategoryWiseData()
                return;
            }
        } catch { }
        await catagoriesApiService.getUserCategories().then(async res => {
            const spendCategories = res.data?.spend_categories ?? [];
            const incomeCategories = res.data?.income_categories ?? [];
            updateSpendCategories(spendCategories);
            updateIncomeCategories(incomeCategories);
            let categoriesObject: any = {};
            for (let category of spendCategories) {
                categoriesObject[category._id] = category
            }
            for (let category of incomeCategories) {
                categoriesObject[category._id] = category
            }
            updateCategoriesObject(categoriesObject)
        }).catch(() => {
            updateCategoriesObject({});
            updateAllCategoryValue({})
            updateCategoryTableData([]);
            updateSpendCategories([]);
            updateIncomeCategories([]);
        })
    }

    useEffect(() => {
        if (Object.keys(categoriesObject).length) {
            getCategoryWiseData();
        }
    }, [categoriesObject])

    function getUserTransactions() {
        updateOverallLoaderFlag(true)
        const monthStart = selectedMonth.startOf("month");
        const monthEnd = moment(monthStart).add(1, "month");
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStart.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEnd.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getOverallLogs(body).then(res => {
            const data = res.data
            try {
                const overallData = {
                    spend: data.spend.total,
                    income: data.income.total,
                    estimation: data.estimation.total,
                    avgSpends: data.spend.avg,
                    max: data.spend.max,
                    min: data.spend.min,
                }
                updateOverallCardData(overallData)
                setLineChart(data.spend)
            } catch { }
            updateOverallLoaderFlag(false)
        }).catch(() => {
            updateOverallLoaderFlag(false);
            updateLineChartStatus(false);
        })
    }

    /**
     * The function `setLineChart` processes spend data for each day in a selected month and generates
     * a line chart visualization.
     * @param {any} spendData - It looks like the code snippet you provided is a TypeScript function
     * for setting up a line chart based on spend data. The function takes `spendData` as a parameter,
     * which seems to be an object containing day-wise spending data.
     * @returns The `setLineChart` function is returning the options object that contains the
     * configuration for a line chart, which includes the chart type, title, x-axis and y-axis
     * settings, tooltip formatting, accessibility options, credits, legend, plot options, and series
     * data for the chart.
     */
    function setLineChart(spendData: any) {
        let dayObject: any = {};
        let categoryArray: any[] = [];
        let seriesData: any[] = [];
        let validData = false;
        try {
            for (let item of spendData.day_wise) {
                dayObject[timeConversionsService.dateTimeFormat(item.day, "yyyy-MM-DD HH:mm:ss")] = {
                    ...item,
                    day_total: item.data.reduce((sum: number, record: any) => { return (sum + record.value) }, 0)
                }
            }
            const month_end = selectedMonth.endOf("month").get("date");
            for (let i = 1; i <= month_end; i++) {
                const thisDay = new Date(selectedMonth.get("year"), selectedMonth.get("month"), i);
                const dayInUtc = timeConversionsService.convertLocalDateTimeToUtc(thisDay, "yyyy-MM-DD HH:mm:ss") as string;
                const value = dayObject[dayInUtc] ? dayObject[dayInUtc].day_total : 0
                seriesData.push({
                    y: value,
                    date: thisDay,
                    display: helperService.formatCurrencyValue(value)
                })
                if (value) {
                    validData = true
                }
                categoryArray.push(timeConversionsService.dateTimeFormat(thisDay, "DD"))
            }
        } catch {
            updateLineChartStatus(false)
            return
        }
        updateLineChartStatus(validData)
        const options = {
            chart: {
                backgroundColor: "transparent",
                type: "spline",
            },
            title: {
                text: 'Day Wise Spends'
            },
            xAxis: {
                categories: categoryArray,
            },
            yAxis: {
                title: {
                    text: "",
                    useHTML: true
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                endOnTick: false,
                maxPadding: 0.1
            },
            tooltip: {
                formatter: function () {
                    let this_graph: any = this;
                    try {
                        let point = this_graph.point;
                        return `
                        <div class="chart-tooltip spend-chart-tooltip">
                            <div>
                                 ${timeConversionsService.dateTimeFormat(point.date, "ddd, MMM Do YYYY")} 
                            </div>
                            <div class="percentage">
                                Spend : ${point.display}
                            </div>
                        </div>
                    `
                    } catch { }
                    return ""
                },
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                useHTML: true,
            },
            accessibility: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    borderWidth: 0
                },
                area: {
                    marker: {
                        enabled: false,
                        radius: 0,
                    }
                },
            },
            series: [
                {
                    name: 'Spends',
                    color: "#fa4b42",
                    data: seriesData
                },]
        };
        updateMonthSpendChart(options)
    }

    function getCategoryWiseData() {
        updateCategoryLoadFlag(true)
        const monthStart = selectedMonth.startOf("month");
        const monthEnd = moment(monthStart).add(1, "month");
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStart.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEnd.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getMonthCategoryWise(body).then(res => {
            updateAllCategoryValue(res.data?.data ?? {})
            updateCategoryLoadFlag(false);
        }).catch(() => {
            updateCategoryLoadFlag(false);
            updateCategoryTableData([]);
        })
    }

    useEffect(() => {
        setCategoryWisePieChart();
        setCategoryWiseTableData();
    }, [allCategoryValue])

    useEffect(() => {
        try {
            if (Object.keys(allCategoryValue).length) {
                setCategoryWiseTableData();
            }
        } catch { }
    }, [transactionType])

    function setCategoryWiseTableData() {
        const currentTypeData = allCategoryValue[transactionType.dbKeyPleural];
        const catagories = (transactionType.key === "spend" || transactionType.key === "estimation") ? spendCategories : incomeCategories;
        let data: any[] = [];
        try {
            for (let item of catagories) {
                data.push({
                    ...item,
                    ...(currentTypeData[item._id] ? { data: currentTypeData[item._id] } : {})
                })
            }
            data.sort((a, b) => ((a.data?.total ?? 0) < (b.data?.total ?? 0) ? 1 : -1))
        } catch {
            data = []
        }
        updateCategoryTableData(data)
    }

    /**
     * The function `setCategoryWisePieChart` generates a pie chart displaying category-wise spends
     * with tooltips and custom styling in a TypeScript React application.
     * @returns The `setCategoryWisePieChart` function is setting up a pie chart for displaying
     * category-wise spends. It is creating the necessary data and options for the pie chart, including
     * series data with category names, total spend values, icons, and formatted display values. The
     * function also handles the tooltip formatting and updates the pie chart status.
     */
    function setCategoryWisePieChart() {
        let pieChartStatus = false;
        let seriesData = [];
        try {
            const spendData = allCategoryValue.debits
            for (let id in spendData) {
                if (spendData[id].total) {
                    pieChartStatus = true
                }
                seriesData.push({
                    name: categoriesObject[id].name,
                    y: spendData[id].total,
                    icon: `<i class="${categoriesObject[id].icon}"></i>`,
                    display_value: helperService.formatCurrencyValue(spendData[id].total)
                })
            }
        } catch {
            pieChartStatus = false
        }
        updateCategoryPieStatus(pieChartStatus)

        const options = {
            chart: {
                type: 'pie',
                backgroundColor: "transparent",
            },
            title: {
                text: 'Category Wise Spends',
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    let this_graph: any = this;
                    try {
                        let current_point = this_graph.point;
                        return `
                        <div class="chart-tooltip category-chart-tooltip">
                            <div>
                                <span style="color: ${current_point.color}">${current_point.icon}</span> ${current_point.name} : ${current_point.display_value}
                            </div>
                            <div class="percentage">
                                Percentage : ${current_point.percentage.toFixed(2)}%
                            </div>
                        </div>
                    `
                    } catch { }
                    return ""
                },
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                useHTML: true,
            },
            plotOptions: {
                pie: {
                    innerSize: '20%',
                    depth: 45,
                    dataLabels: {
                        useHTML: true,
                    },
                    borderColor: "transparent"
                },
            },
            series: [{
                name: 'Spends',
                borderRadius: 5,
                data: seriesData,
            }]
        }
        updateCategoryWisePie(options)
    }

    function overallDataCard() {
        return <>
            <div className={`overview ${loadOverallData && "placeholder-glow"}`} >
                <div className="overview-block spend">
                    <div className="block-left">
                        <div className="amount">
                            {
                                loadOverallData ? <span className="placeholder col-10"></span> :
                                    <Currency value={overallCardData.spend ?? 0} />
                            }
                        </div>
                        <div className="name">
                            Spends
                        </div>
                    </div>
                    <div className="block-right">
                        <div className="icon">
                            <i className="fa-solid fa-money-bill-trend-up"></i>
                        </div>
                    </div>
                </div>
                <div className="overview-block estimation">
                    <div className="block-left">
                        <div className="amount">
                            {
                                loadOverallData ? <span className="placeholder col-10"></span> :
                                    <Currency value={overallCardData.estimation ?? 0} />
                            }
                        </div>
                        <div className="name">
                            Estimation
                        </div>
                    </div>
                    <div className="block-right">
                        <div className="icon">
                            <i className="fa-solid fa-file-invoice"></i>
                        </div>
                    </div>
                </div>
                <div className="overview-block income">
                    <div className="block-left">
                        <div className="amount">
                            {
                                loadOverallData ? <span className="placeholder col-10"></span> :
                                    <Currency value={overallCardData.income ?? 0} />
                            }
                        </div>
                        <div className="name">
                            Income
                        </div>
                    </div>
                    <div className="block-right">
                        <div className="icon">
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                        </div>
                    </div>
                </div>
                <div className="overview-block avg">
                    <div className="block-left">
                        <div className="amount">
                            {
                                loadOverallData ? <span className="placeholder col-10"></span> :
                                    <Currency value={overallCardData.avgSpends ?? 0} />
                            }
                        </div>
                        <div className="name">
                            Average Spends
                        </div>
                    </div>
                    <div className="block-right">
                        <div className="icon">
                            <i className="fa-solid fa-chart-bar"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    function monthUpdated(event: any): any {
        updateAnalysisMonth(event.value)
    }

    /**
     * The function `openSingleCategoryTransaction` fetches transaction log data for a specific
     * category within a given month and updates the UI accordingly.
     * @param {any} category - The `openSingleCategoryTransaction` function takes a `category`
     * parameter as input. This parameter represents the category for which the transaction log is
     * being opened. The function then performs various operations such as updating the category log
     * loader, setting the selected category, clearing the log data, and fetching the transaction log
     */
    function openSingleCategoryTransaction(category: any) {
        updateSingleCategoryLogLoader(true)
        updateSingleCategory(category)
        updateSingleCatLogData([])
        $("#categoryWiseLog").offcanvas("show")
        const monthStart = selectedMonth.startOf("month");
        const monthEnd = moment(monthStart).add(1, "month");
        const body = {
            category_id: category._id,
            type: transactionType.dbKey,
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStart.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEnd.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getMonthSingleCategoryWise(body).then(res => {
            const data = res.data?.data ?? [];
            let logData: any[] = []
            for (let dayItem of data) {
                logData = logData.concat(dayItem.data)
            }
            updateSingleCatLogData(logData)
            updateSingleCategoryLogLoader(false)
        }).catch(() => {
            updateSingleCatLogData([])
            updateSingleCategoryLogLoader(false)
        })
    }

    function tableLoadingTemplate() {
        return <>
            <div className="custom-table">
                <table className="sticky-head">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    {
                        <tbody className="placeholder-glow">
                            {
                                Array(10).fill(0).map((_e, i) => (
                                    <tr key={i}>
                                        {
                                            Array(3).fill(0).map((_t, j) => (
                                                <td key={j}>
                                                    <div className="placeholder col-12"></div>
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    }
                </table>
            </div>
        </>
    }

    return (
        <>
            <div className="page-header">
                <div className="page-title">
                    Analysis
                </div>
                <div className="page-options">
                    <div className="option">
                        <MonthPicker id="analysis-month-picker" maxDate={moment()} value={selectedMonth} monthSelected={monthUpdated} />
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="row m-0">
                    <div className="col-12 p-0">
                        <div className="card-body">
                            {overallDataCard()}
                        </div>
                    </div>
                </div>
                <div className="category-kpi">
                    <div className="category-pie-block">
                        <div className="card">
                            <div className="card-body">
                                {
                                    loadCategoryData ?
                                        <div className="category-pie-chart placeholder-glow">
                                            <div className="placeholder col-12"></div>
                                        </div>
                                        :
                                        <>
                                            {
                                                validCategoryPie ?
                                                    <HighchartsReact containerProps={{ className: "category-pie-chart" }} highcharts={Highcharts} options={categoryWisePie} />
                                                    :
                                                    <div className="category-pie-chart">
                                                        <div className="centred-block-full-height">
                                                            <NoData title="No Data" text="No Category Data" />
                                                        </div>
                                                    </div>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="month-min-max">
                        <div className="kpi-block max">
                            {
                                loadOverallData ?
                                    <div className="max-value placeholder-glow">
                                        <div className="value-group">
                                            <div className="value-data">
                                                <div className="value">
                                                    <div className="placeholder col-8"></div>
                                                </div>
                                                <div className="title">
                                                    Month Max On
                                                </div>
                                            </div>
                                            <div className="icon loading">
                                                <div className="placeholder col-12"></div>
                                            </div>
                                        </div>
                                        <div className="category-data">
                                            <div className="name">
                                                <div className="placeholder col-6"></div>
                                            </div>
                                            <div className="percentage">
                                                <div className="placeholder col-10"></div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="max-value">
                                        <div className="value-group">
                                            <div className="value-data">
                                                <div className="value">
                                                    <Currency value={overallCardData.max?.value ?? 0} />
                                                </div>
                                                <div className="title">
                                                    Month Max On
                                                </div>
                                            </div>
                                            <div className="icon">
                                                <i className={overallCardData.max?.category_id ? (categoriesObject[overallCardData.max.category_id].icon) : "fa-solid fa-arrow-trend-up"}></i>
                                            </div>
                                        </div>
                                        <div className="category-data">
                                            <div className="name">
                                                {overallCardData.max?.category_id ? (categoriesObject[overallCardData.max.category_id].name) : "----"}
                                            </div>
                                            <div className={`percentage ${overallCardData.max?.percentage > 20 ? "red" : "green"}`}>
                                                {transformationService.roundOff(overallCardData.max?.percentage ?? 0) ?? 0}%
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className="kpi-block min">
                            {
                                loadOverallData ?
                                    <div className="max-value placeholder-glow">
                                        <div className="value-group">
                                            <div className="value-data">
                                                <div className="value">
                                                    <div className="placeholder col-8"></div>
                                                </div>
                                                <div className="title">
                                                    Month Min On
                                                </div>
                                            </div>
                                            <div className="icon loading">
                                                <div className="placeholder col-12"></div>
                                            </div>
                                        </div>
                                        <div className="category-data">
                                            <div className="name">
                                                <div className="placeholder col-6"></div>
                                            </div>
                                            <div className="percentage">
                                                <div className="placeholder col-10"></div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="max-value">
                                        <div className="value-group">
                                            <div className="value-data">
                                                <div className="value">
                                                    <Currency value={overallCardData.min?.value ?? 0} />
                                                </div>
                                                <div className="title">
                                                    Month Min On
                                                </div>
                                            </div>
                                            <div className="icon">
                                                <i className={overallCardData.min?.category_id ? (categoriesObject[overallCardData.min.category_id].icon) : "fa-solid fa-arrow-trend-up"}></i>
                                            </div>
                                        </div>
                                        <div className="category-data">
                                            <div className="name">
                                                {overallCardData.min?.category_id ? (categoriesObject[overallCardData.min.category_id].name) : "----"}
                                            </div>
                                            <div className={`percentage ${overallCardData.min?.percentage > 20 ? "red" : "green"}`}>
                                                {transformationService.roundOff(overallCardData.min?.percentage ?? 0) ?? 0}%
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="top-margin">
                    <div className="card">
                        <div className="card-body p-1">
                            {
                                loadOverallData ?
                                    <div className="day-wise-spends placeholder-glow">
                                        <div className="placeholder col-12"></div>
                                    </div>
                                    :
                                    <>
                                        {
                                            validLineChart ?
                                                <HighchartsReact containerProps={{ className: "day-wise-spends" }} highcharts={Highcharts} options={monthSpendChart} />
                                                :
                                                <div className="day-wise-spends">
                                                    <div className="centred-block-full-height">
                                                        <NoData title="No Data" text="Data not available for month" />
                                                    </div>
                                                </div>
                                        }
                                    </>
                            }

                        </div>
                    </div>
                </div>
                <div className="top-margin">
                    <div className="card">
                        <div className="card-header">
                            <div className="d-flex align-items-center">
                                Category Wise <div className="ms-2">
                                    <div className="dropdown fnx-dropdown">
                                        <a className="btn btn-secondary btn-sm dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {transactionType.name}
                                        </a>

                                        <ul className="dropdown-menu">
                                            {
                                                transactionsType.map(type => (
                                                    <li key={type.key}><a className={`dropdown-item ${transactionType.key === type.key ? "active" : ""}`} onClick={() => {
                                                        updateTransactionType({ ...type })
                                                    }}>
                                                        {type.plural}
                                                    </a></li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {
                                loadCategoryData ? tableLoadingTemplate() :
                                    <>
                                        {
                                            categoryTableData.length ?
                                                <div className="custom-table">
                                                    <table className="sticky-head">
                                                        <thead>
                                                            <tr>
                                                                <th>Category</th>
                                                                <th>Amount</th>
                                                                <th>Count</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                categoryTableData.map(category => (
                                                                    <tr key={category._id} className={`${category.data?.total ? "can-hover" : ""}`} onClick={() => {
                                                                        if (category.data?.total) {
                                                                            openSingleCategoryTransaction(category)
                                                                        }
                                                                    }}>
                                                                        <td>
                                                                            <i className={`${category.icon} width-30`}></i> {category.name}
                                                                        </td>
                                                                        <td><Currency value={category.data?.total ?? 0} /></td>
                                                                        <td>{category.data?.count ?? 0}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                :
                                                <div className="centred-block-min-height">
                                                    <NoData title="No Data" text="No Category Data" />
                                                </div>
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} id="categoryWiseLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Spends on category
                    </div>
                    <div className="options">
                        <div className="option-item close">
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                {
                    selectedSingleCategory &&
                    <div className="offcanvas-body">
                        <div className="single-category-data">
                            <div className="overall-block">
                                <div className="icon">
                                    <i className={selectedSingleCategory.icon}></i>
                                </div>
                                <div className="category-details">
                                    <div className="data">
                                        <div className="name">
                                            {selectedSingleCategory.name}
                                        </div>
                                        <div className="count">
                                            ({selectedSingleCategory.data?.count ?? 0})
                                        </div>
                                    </div>
                                    <div className="value">
                                        <Currency value={selectedSingleCategory.data?.total} />
                                    </div>
                                </div>
                            </div>
                            {
                                loadSingleCategoryLog ?
                                    <div className="transactions-offcanvas-view placeholder-glow">
                                        {
                                            Array(10).fill(0).map((_e, i) => (
                                                <div className="transaction-block" key={i}>
                                                    <div className="data-block">
                                                        <div className="value-block">
                                                            <div className={`transaction-icon me-2 ${transactionType.key === "spend" ? "spend" : (transactionType.key === "estimation" ? "estimation" : "income")
                                                                }`}>
                                                                <i className="fa-solid fa-circle"></i>
                                                            </div>
                                                            <div className="value loading">
                                                                <div className="placeholder col-12"></div>
                                                            </div>
                                                        </div>
                                                        <div className="time loading">
                                                            <i className="fa-regular fa-clock"></i> <div className="placeholder col-10 ms-2"></div>
                                                        </div>
                                                    </div>
                                                    <div className="remarks">
                                                        <div className="placeholder col-11 "></div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    :
                                    <div className="transactions-offcanvas-view">
                                        {
                                            singleCatLogData.map(logItem => (
                                                <div className="transaction-block" key={logItem._id}>
                                                    <div className="data-block">
                                                        <div className="value-block">
                                                            <div className={`transaction-icon me-2 ${transactionType.key === "spend" ? "spend" : (transactionType.key === "estimation" ? "estimation" : "income")
                                                                }`}>
                                                                <i className="fa-solid fa-circle"></i>
                                                            </div>
                                                            <div className="value">
                                                                <Currency value={logItem.value} />
                                                            </div>
                                                        </div>
                                                        <div className="time">
                                                            <i className="fa-regular fa-clock"></i> {timeConversionsService.convertUtcDateTimeToLocal(logItem.created_at, "DD-MM-YYYY HH:mm:ss") as string}
                                                        </div>
                                                    </div>
                                                    <div className="remarks">
                                                        {logItem.remarks}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
