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
    const [chart_options, setChartOptions] = useState({})

    useEffect(() => {
        setTimeout(() => {
            setOverallDataLoader(false)
        }, 1000)
        setChart()
    }, [])

    function setChart() {
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

    function overallDataCard() {
        if (load_overall_data) {
            return <>
                <div className="overall-container placeholder-glow">
                    {
                        Array(5).fill(null).map((e, i) => (
                            <div className="overall-block" key={i} >
                                <div className="block-left">
                                    <div className="icon">
                                        <span className="placeholder col-2"></span>
                                    </div>
                                </div>
                                <div className="block-right">
                                    <div className="amount">
                                        <span className="placeholder col-6"></span>
                                    </div>
                                    <div className="name">
                                        <span className="placeholder col-7"></span>
                                    </div>
                                    <div className="remarks">
                                        <span className="placeholder col-6"></span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        } else {
            return <>
                <div className="overall-container">
                    <div className="overall-block spend">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-money-bill-trend-up"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["total_spends"] ? overall_card_details["total_spends"] : 0} />
                            </div>
                            <div className="name">
                                Spends
                            </div>
                            <div className="remarks"></div>
                        </div>
                    </div>
                    <div className="overall-block estimation">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-file-invoice"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["total_estimations"] ? overall_card_details["total_estimations"] : 0} />
                            </div>
                            <div className="name">
                                Estimation
                            </div>
                            <div className="remarks"></div>
                        </div>
                    </div>
                    <div className="overall-block income">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["total_income"] ? overall_card_details["total_income"] : 0} />
                            </div>
                            <div className="name">
                                Income
                            </div>
                            <div className="remarks"></div>
                        </div>
                    </div>
                    <div className="overall-block max">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-arrow-trend-up"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["max_spend"] ? overall_card_details["max_spend"] : 0} />
                            </div>
                            <div className="name">
                                Month Max Spends
                            </div>
                            <div className="remarks">
                                {/* On {{ user_categories_object[overall_details['max_spend_on_category']].name }} */}
                                On Home
                            </div>
                        </div>
                    </div>
                    <div className="overall-block year-total">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-chart-bar"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["spend_avg"] ? overall_card_details["spend_avg"] : 0} />
                            </div>
                            <div className="name">
                                Month Average Spends
                            </div>
                            <div className="remarks">
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
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
                            <div className="card-body" style={{}}>
                                <div>
                                    <HighchartsReact containerProps={{ className: "day-wise-spends" }} highcharts={Highcharts} options={chart_options} />
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
                                    <div className="card-body"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
