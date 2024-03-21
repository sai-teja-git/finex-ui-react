import { useEffect, useState } from "react";

import "../../assets/css/components/Dashboard.scss";
import Currency from "../../components/Currency";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from "moment-timezone";
import helperService from "../../services/helper-functions.service"

export default function Dashboard() {

    const [load_overall_data, setOverallDataLoader] = useState(true);
    const [overall_card_details, setOverallCardDetails] = useState<Record<string, any>>({});
    const [month_spend_chart, setChartOptions] = useState({})
    const [overall_gauge, setOverallGaugeChart] = useState({})

    useEffect(() => {
        setTimeout(() => {
            setOverallDataLoader(false)
        }, 1000)
        setLineChart();
        setGaugeChart()
    }, [])

    function setLineChart() {
        let spends_till_now = 0;
        let categ_arr: any[] = [];
        let spends_arr: any[] = [];
        const month_end = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
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

    function setGaugeChart() {
        const colors = ["#feb56a", "#fa4b42", "#00e272"]
        const options = {

            chart: {
                type: 'solidgauge',
                height: '110%',
                // events: {
                //     render: renderIcons
                // }
            },

            title: {
                text: 'Multiple KPI gauge',
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
                valueSuffix: '%',
                pointFormat: '{series.name}<br>' +
                    '<span style="font-size: 2em; color: {point.color}; ' +
                    'font-weight: bold">{point.y}</span>',
                // positioner: function (labelWidth) {
                //     return {
                //         x: (this.chart.chartWidth - labelWidth) / 2,
                //         y: (this.chart.plotHeight / 2) + 15
                //     };
                // }
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Conversion
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: colors[0] + "4d",
                    borderWidth: 0
                }, { // Track for Engagement
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: colors[1] + "4d",
                    borderWidth: 0
                }, { // Track for Feedback
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
                name: 'Conversion',
                data: [{
                    color: colors[0],
                    radius: '112%',
                    innerRadius: '88%',
                    y: 80
                }],
                custom: {
                    icon: 'filter',
                    iconColor: '#303030'
                }
            }, {
                name: 'Engagement',
                data: [{
                    color: colors[1],
                    radius: '87%',
                    innerRadius: '63%',
                    y: 65
                }],
                custom: {
                    icon: 'comments-o',
                    iconColor: '#ffffff'
                }
            }, {
                name: 'Feedback',
                data: [{
                    color: colors[2],
                    radius: '62%',
                    innerRadius: '38%',
                    y: 50
                }],
                custom: {
                    icon: 'commenting-o',
                    iconColor: '#303030'
                }
            }]
        }
        setOverallGaugeChart(options)
    }

    function overallDataNewCard() {
        return <>
            <div className="overview">
                <div className="overview-block spend">
                    <div className="block-left">
                        <div className="amount">
                            <Currency value={overall_card_details["total_spends"] ? overall_card_details["total_spends"] : 0} />
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
                            <Currency value={overall_card_details["total_estimations"] ? overall_card_details["total_estimations"] : 0} />
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
                            <Currency value={overall_card_details["total_income"] ? overall_card_details["total_income"] : 0} />
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
                            <Currency value={overall_card_details["spend_avg"] ? overall_card_details["spend_avg"] : 0} />
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
            <div className="page-body no-header">
                <div className="row m-0">
                    <div className="col-12 p-0">
                        <div className="card-body">
                            {overallDataNewCard()}
                        </div>
                    </div>
                </div>
                <div className="row m-0 mt-3">
                    <div className="col-12 p-0">
                        <div className="card">
                            <div className="card-body">
                                <div>
                                    <HighchartsReact containerProps={{ className: "day-wise-spends" }} highcharts={Highcharts} options={month_spend_chart} />
                                </div>
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
                            <div className="card-body p-0" style={{ height: "200px", overflow: "auto" }}>
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
                                        <tbody>
                                            {
                                                Array(10).fill(0).map((e, i) => (
                                                    <tr key={i}>
                                                        <td>Category-{i + 1}</td>
                                                        <td><Currency value={(i + 1) * 10} /></td>
                                                        <td>{i + 1}</td>
                                                        <td>Remarks----{i + 1}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3 pe-0 ps-xl-2 ps-lg-2 ps-md-0 ps-0">
                        <div className="row m-0">
                            <div className="col-xl-12 col-lg-12 col-md-6 col-sm-12 ps-0 pe-xl-0 pe-lg-0 pe-md-2 pe-0">
                                <div className="max-value">
                                    <div className="value-group">
                                        <div className="value-data">
                                            <div className="value">
                                                <Currency value={1000} />
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
                            </div>
                            <div className="pie-graph col-xl-12 col-lg-12 col-md-6 col-sm-12 pe-0 ps-xl-0 ps-lg-0 ps-md-2 ps-0 mt-xl-3 mt-lg-3 mt-md-0 mt-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div>
                                            {/* <HighchartsReact containerProps={{ className: "day-wise-spends" }} highcharts={Highcharts} options={overall_gauge} /> */}
                                        </div>
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
