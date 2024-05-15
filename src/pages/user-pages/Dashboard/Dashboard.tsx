import { useEffect, useState } from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accessibility from "highcharts/modules/accessibility";
import SolidGauge from "highcharts/modules/solid-gauge";
import Currency from "../../../components/Currency";
import helperService from "../../../services/helper-functions.service";
import "./Dashboard.scss";

import highchartsMore from "highcharts/highcharts-more";
import catagoriesApiService from "../../../api/categories.api.service";
import transactionLogApiService from "../../../api/transaction-log.api.service";
import NoData from "../../../components/NoData";
import timeConversionsService from "../../../services/time-conversions.service";
import transformationService from "../../../services/transformations.service";

highchartsMore(Highcharts);
SolidGauge(Highcharts);
Accessibility(Highcharts);

export default function Dashboard() {

    const monthStartTime = new Date(timeConversionsService.dateTimeFormat(new Date(), "YYYY-MM-01 00:00:00"));
    const monthEndTime = new Date(monthStartTime.getFullYear(), monthStartTime.getMonth() + 1, 1);
    const [categoriesObject, updateCategoriesObject] = useState<any>({});
    const [spendCategories, updateSpendCategories] = useState<any[]>([]);
    const [loadOverallData, updateOverallLoaderFlag] = useState(true);
    const [overallCardData, updateOverallCardData] = useState<Record<string, any>>({})
    const [overallGauge, setOverallGaugeChart] = useState({});
    const [validGauge, updateGaugeStatus] = useState(false);
    const [validLineChart, updateLineChartStatus] = useState(false)
    const [monthSpendChart, updateMonthSpendChart] = useState({});
    const [loadCategoryTable, updateCategoryTableFlag] = useState(true);
    const [categoryTableData, updateCategoryTableData] = useState<any[]>([]);

    useEffect(() => {
        getDefaultData()
    }, [])

    async function getDefaultData() {
        await getUserCatagories();
        getUserTransactions()
    }

    async function getUserCatagories() {
        await catagoriesApiService.getUserCategories().then(async res => {
            const spendCategories = res.data?.spend_categories ?? [];
            const incomeCategories = res.data?.income_categories ?? [];
            updateSpendCategories(spendCategories);
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
            updateCategoryTableData([]);
        })
    }

    useEffect(() => {
        if (Object.keys(categoriesObject).length) {
            getCategoryWiseData();
        }
    }, [categoriesObject])

    function getUserTransactions() {
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStartTime, "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEndTime, "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getOverallLogs(body).then(res => {
            const data = res.data
            try {
                const overallData = {
                    spend: data.spend.total,
                    income: data.income.total,
                    estimation: data.estimation.total,
                    avgSpends: data.spend.avg,
                    max: data.spend.max
                }
                updateOverallCardData(overallData)
                setGaugeChart(overallData)
                setLineChart(data.spend)
            } catch { }
            updateOverallLoaderFlag(false)
        }).catch(() => {
            updateOverallLoaderFlag(false);
            updateGaugeStatus(false);
            updateLineChartStatus(false);
        })
    }

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
            const month_end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
            for (let i = 1; i <= month_end; i++) {
                const thisDay = new Date(new Date().getFullYear(), new Date().getMonth(), i);
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

    function setGaugeChart(overallData: any) {
        if (overallData.spend || overallData.estimation || overallData.income) {
            updateGaugeStatus(true)
        }
        const maxBase = Math.max(overallData.spend, overallData.estimation, overallData.income)
        const spendPercentage = helperService.calculatePercentage(overallData.spend, maxBase, 2)
        const estimationPercentage = helperService.calculatePercentage(overallData.estimation, maxBase, 2)
        const incomePercentage = helperService.calculatePercentage(overallData.income, maxBase, 2)
        const colors = ["#ffb212", "#fa4b42", "#00e272"]
        const options = {

            chart: {
                type: 'solidgauge',
                backgroundColor: "transparent",
            },

            title: {
                text: 'This Month Total',
                style: {
                    fontSize: '24px'
                }
            },

            tooltip: {
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '16px'
                },
                useHTML: true,
                outside: true,
                valueSuffix: '%',
                pointFormat: '<span class="month-overall-gauge-tooltip-name">{series.name}</span><br>' +
                    '<span style="font-size: 2em; color: {point.color}; ' +
                    'font-weight: bold">{point.y}</span>',
                positioner: function () {
                    return { x: -15, y: 25 }
                }
            },
            credits: {
                enabled: false
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: colors[0] + "4d",
                    borderWidth: 0
                }, {
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: colors[1] + "4d",
                    borderWidth: 0
                }, {
                    outerRadius: '62%',
                    innerRadius: '38%',
                    backgroundColor: colors[2] + "4d",
                    borderWidth: 0
                }]
            },

            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true
                }
            },

            series: [{
                name: 'Estimation',
                data: [{
                    color: colors[0],
                    radius: '112%',
                    innerRadius: '88%',
                    y: estimationPercentage
                }],
                custom: {
                    icon: 'filter',
                    iconColor: '#303030'
                }
            }, {
                name: 'Spends',
                data: [{
                    color: colors[1],
                    radius: '87%',
                    innerRadius: '63%',
                    y: spendPercentage
                }],
                custom: {
                    icon: 'comments-o',
                    iconColor: '#ffffff'
                }
            }, {
                name: 'Income',
                data: [{
                    color: colors[2],
                    radius: '62%',
                    innerRadius: '38%',
                    y: incomePercentage
                }],
                custom: {
                    icon: 'commenting-o',
                    iconColor: '#303030'
                }
            }]
        }
        setOverallGaugeChart(options)
    }

    function getCategoryWiseData() {
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStartTime, "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEndTime, "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getMonthCategoryWise(body).then(res => {
            let data: any[] = [];
            try {
                const spendData = res.data?.data.debits;
                for (let item of spendCategories) {
                    data.push({
                        ...item,
                        ...(spendData[item._id] ? { data: spendData[item._id] } : {})
                    })
                }
                data.sort((a, b) => ((a.data?.total ?? 0) < (b.data?.total ?? 0) ? 1 : -1))
            } catch {
                data = []
            }
            updateCategoryTableData(data)
            updateCategoryTableFlag(false);
        }).catch(() => {
            updateCategoryTableFlag(false);
            updateCategoryTableData([]);
        })
    }

    function overallDataCardTemplate() {
        return <>
            <div className={`overview ${loadOverallData && "placeholder-glow"}`} >
                <div className="overview-block spend">
                    <div className="block-left">
                        <div className="amount">
                            {
                                loadOverallData ? <span className="placeholder col-10"></span> :
                                    <Currency value={overallCardData.spend ? overallCardData.spend : 0} />
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
                                    <Currency value={overallCardData.estimation ? overallCardData.estimation : 0} />
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
                                    <Currency value={overallCardData.income ? overallCardData.income : 0} />
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
                                    <Currency value={overallCardData.avgSpends ? overallCardData.avgSpends : 0} />
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

    function categoryTableLoadTemplate() {
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
                </table>
            </div>
        </>
    }

    return (
        <>
            <div className="page-body no-header">
                <div className="row m-0">
                    <div className="col-12 p-0">
                        <div className="card-body">
                            {overallDataCardTemplate()}
                        </div>
                    </div>
                </div>
                <div className="row m-0 mt-3">
                    <div className="col-12 p-0">
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
                                                            <NoData title="No Data" />
                                                        </div>
                                                    </div>
                                            }
                                        </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 mt-3 ps-0 pe-xl-2 pe-lg-2 pe-md-0 pe-0">
                        <div className="card">
                            <div className="card-header">
                                Spends Data
                            </div>
                            <div className="card-body category-table p-0">
                                {
                                    loadCategoryTable ? categoryTableLoadTemplate() :
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
                                                                        <tr key={category._id}>
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
                                                    <div className="centred-block-full-height">
                                                        <NoData title="No Data" text="No Category Data" />
                                                    </div>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3 pe-0 ps-xl-2 ps-lg-2 ps-md-0 ps-0">
                        <div className="row m-0">
                            <div className="col-xl-12 col-lg-12 col-md-6 col-sm-12 ps-0 pe-xl-0 pe-lg-0 pe-md-2 pe-0">
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
                            <div className="col-xl-12 col-lg-12 col-md-6 col-sm-12 pe-0 ps-xl-0 ps-lg-0 ps-md-2 ps-0 mt-xl-3 mt-lg-3 mt-md-0 mt-3">
                                <div className="card">
                                    <div className="card-body">
                                        {
                                            loadOverallData ?
                                                <div className="month-overall-gauge placeholder-glow">
                                                    <div className="placeholder col-12"></div>
                                                </div>
                                                :
                                                <>
                                                    {
                                                        validGauge ?
                                                            <HighchartsReact containerProps={{ className: "month-overall-gauge" }} highcharts={Highcharts} options={overallGauge} />
                                                            :
                                                            <div className="month-overall-gauge placeholder-glow">
                                                                <div className="centred-block-full-height">
                                                                    <NoData title="No Data" />
                                                                </div>
                                                            </div>
                                                    }
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
