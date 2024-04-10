import "./Analysis.scss";
import Currency from "../../../components/Currency";
import { useEffect, useState } from "react";
import helperService from "../../../services/helper-functions.service";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accessibility from "highcharts/modules/accessibility";
import moment, { Moment } from "moment-timezone";
import MonthPicker from "../../../components/MonthPicker/MonthPicker";
Accessibility(Highcharts);

export default function Analysis() {

    const [overall_card_details, setOverallCardDetails] = useState<Record<string, any>>({});
    const [dummy_loader, setDummyLoader] = useState(true);
    const [month_spend_chart, setChartOptions] = useState({});
    const [category_pie, updateCategoryPieChart] = useState({});

    useEffect(() => {
        setCategoryWisePieChart();
        setLineChart();
        setTimeout(() => {
            setDummyLoader(false)
        }, 1500)
    }, [])

    function setCategoryWisePieChart() {
        const catg_data = [
            {
                "name": "Cloths",
                "icon": "fa-solid fa-shirt"
            },
            {
                "name": "Car",
                "icon": "fa-solid fa-car-side"
            },
            {
                "name": "Health",
                "icon": "fa-solid fa-suitcase-medical"
            },
            {
                "name": "Eating Out",
                "icon": "fa-solid fa-utensils"
            },
            {
                "name": "Bills",
                "icon": "fa-solid fa-file-invoice-dollar"
            },
            {
                "name": "Food",
                "icon": "fa-solid fa-bowl-food"
            },
            {
                "name": "Gifts",
                "icon": "fa-solid fa-gift"
            },
            {
                "name": "Pets",
                "icon": "fa-solid fa-paw"
            },
            {
                "name": "Entertainment",
                "icon": "fa-solid fa-martini-glass-citrus"
            },
            {
                "name": "House",
                "icon": "fa-solid fa-house"
            }
        ]
        let series_data = [];
        for (let item of catg_data) {
            const curr_value = helperService.generateRandom(1000, 50000)
            series_data.push({
                name: item.name,
                y: curr_value,
                icon: `<i class="${item.icon}"></i>`,
                display_value: helperService.formatCurrencyValue(curr_value)
            })
        }
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
                    let tool_tip_text = "";
                    try {
                        let current_point = this_graph.point;
                        tool_tip_text += "<span style='color:" + current_point.color + "'>" + current_point.icon + "</span> " + current_point.name + " : " + current_point.display_value + "<br>"
                        tool_tip_text += "Percentage : " + current_point.percentage.toFixed(2) + "%"
                    } catch { }
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
                data: series_data,
            }]
        }
        updateCategoryPieChart(options)
    }

    function setLineChart() {
        let spends_till_now = 0;
        let categ_arr: any[] = [];
        let spends_arr: any[] = [];
        const month_end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        for (let i = 1; i <= month_end; i++) {
            const this_day = new Date(new Date().getFullYear(), new Date().getMonth(), i);
            const spend = i === 1 ? 0 : helperService.generateRandom(100, 500);
            spends_till_now += spend;
            categ_arr.push(moment(this_day).format("DD"))
            spends_arr.push({ y: spend })
        }
        const options = {
            chart: {
                backgroundColor: "transparent",
                type: "spline",
            },
            title: {
                text: 'Day Wise Spends'
            },
            xAxis: {
                categories: categ_arr,
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
                pointFormat: '{series.name} <b>{point.y}</b><br/>',
                shared: true
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
                    data: spends_arr
                },]
        };
        setChartOptions(options)
    }

    function overallDataCard() {
        return <>
            <div className={`overview ${dummy_loader && "placeholder-glow"}`} >
                <div className="overview-block spend">
                    <div className="block-left">
                        <div className="amount">
                            {
                                dummy_loader ? <span className="placeholder col-10"></span> :
                                    <Currency value={overall_card_details["total_spends"] ? overall_card_details["total_spends"] : 0} />
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
                                dummy_loader ? <span className="placeholder col-10"></span> :
                                    <Currency value={overall_card_details["total_estimations"] ? overall_card_details["total_estimations"] : 0} />
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
                                dummy_loader ? <span className="placeholder col-10"></span> :
                                    <Currency value={overall_card_details["total_income"] ? overall_card_details["total_income"] : 0} />
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
                                dummy_loader ? <span className="placeholder col-10"></span> :
                                    <Currency value={overall_card_details["spend_avg"] ? overall_card_details["spend_avg"] : 0} />
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

    return (
        <>
            <div className="page-header">
                <div className="page-title">
                    Analysis
                </div>
                <div className="page-options">
                    <div className="option">
                        <MonthPicker id="analysis-month-picker" maxDate={moment()} />
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
                                    dummy_loader ?
                                        <div className="category-pie-chart placeholder-glow">
                                            <div className="placeholder col-12"></div>
                                        </div>
                                        :
                                        <div>
                                            <HighchartsReact containerProps={{ className: "category-pie-chart" }} highcharts={Highcharts} options={category_pie} />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="month-min-max">
                        <div className="kpi-block max">
                            {
                                dummy_loader ?
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
                                                    <Currency value={1000.68656} />
                                                </div>
                                                <div className="title">
                                                    Month Max On
                                                </div>
                                            </div>
                                            <div className="icon">
                                                {/* <i className="fa-solid fa-arrow-trend-up"></i> */}
                                                <i className="fa-solid fa-home"></i>
                                            </div>
                                        </div>
                                        <div className="category-data">
                                            <div className="name">
                                                Home
                                            </div>
                                            <div className="percentage red">
                                                21%
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className="kpi-block min">
                            {
                                dummy_loader ?
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
                                                    <Currency value={1000.68656} />
                                                </div>
                                                <div className="title">
                                                    Month Min On
                                                </div>
                                            </div>
                                            <div className="icon">
                                                {/* <i className="fa-solid fa-arrow-trend-up"></i> */}
                                                <i className="fa-solid fa-home"></i>
                                            </div>
                                        </div>
                                        <div className="category-data">
                                            <div className="name">
                                                Home
                                            </div>
                                            <div className="percentage red">
                                                21%
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
                                dummy_loader ?
                                    <div className="day-wise-spends placeholder-glow">
                                        <div className="placeholder col-12"></div>
                                    </div>
                                    :
                                    <div>
                                        <HighchartsReact containerProps={{ className: "day-wise-spends" }} highcharts={Highcharts} options={month_spend_chart} />
                                    </div>
                            }

                        </div>
                    </div>
                </div>
                <div className="top-margin">
                    <div className="card">
                        <div className="card-header">
                            Category Wise Spends Data
                        </div>
                        <div className="card-body p-0">
                            <div className="custom-table">
                                <table className="sticky-head">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Count</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    {
                                        dummy_loader ?
                                            <tbody className="placeholder-glow">
                                                {
                                                    Array(10).fill(0).map((_e, i) => (
                                                        <tr key={i}>
                                                            {
                                                                Array(4).fill(0).map((_t, j) => (
                                                                    <td key={j}>
                                                                        <div className="placeholder col-12"></div>
                                                                    </td>
                                                                ))
                                                            }
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            :
                                            <tbody>
                                                {
                                                    Array(10).fill(0).map((_e, i) => (
                                                        <tr key={i}>
                                                            <td>
                                                                <i className="fa-solid fa-home"></i> Category-{i + 1}
                                                            </td>
                                                            <td><Currency value={(i + 1) * 10} /></td>
                                                            <td>{i + 1}</td>
                                                            <td>Remarks----{i + 1}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
