import { useEffect, useState } from "react"
import "../../assets/css/pages/Transactions.scss"
import Currency from "../../components/Currency";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accessibility from "highcharts/modules/accessibility";
import helperService from "../../services/helper-functions.service";
import { renderToString } from "react-dom/server";
import CurrencyCode from "../../components/CurrencyCode";
Accessibility(Highcharts);

export default function Transactions() {

    const [transactions_view, setTransactionsView] = useState("all");
    const [category_pie, updateCategoryPieChart] = useState({})

    useEffect(() => {
        setCategoryWisePieChart()
    }, [])

    function updateTransactionsView() {
        if (transactions_view === "all") {
            setTransactionsView("category_wise")
        } else {
            setTransactionsView("all")
        }
    }

    function test() {
        return <div>Hi</div>
    }

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
                display_value: renderToString(<CurrencyCode />) + " " + curr_value
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
                    return tool_tip_text
                },
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

    return (
        <>
            {/* <NoData title="No Data" text={"Data not available for the page"} /> */}
            <div className="page-body no-header">
                <div className="transactions-page">
                    <div className="transactions-data log">
                        <div className="card">
                            <div className="card-body">
                                <div className="sticky-head">
                                    <div className="header">
                                        <div className="title">
                                            Transactions
                                            <div className="sub-title">
                                                {transactions_view === "all" ? "This Month" : "Category Wise"}
                                            </div>
                                        </div>
                                        <div className="options" onClick={updateTransactionsView}>
                                            {
                                                transactions_view === "all" ?
                                                    <>
                                                        Category Wise<i className="fa-solid fa-angle-right ms-1"></i>
                                                    </>
                                                    :
                                                    <>
                                                        <i className="fa-solid fa-angle-left me-1"></i>View All
                                                    </>
                                            }
                                        </div>
                                    </div>
                                    <div className="search form-group">
                                        <input type="text" id="tra-search" name="tra-search" className="form-control" placeholder="Search Transactions" />
                                    </div>
                                </div>
                                <div className="body">
                                    {
                                        transactions_view === "all" ?
                                            <>
                                                {
                                                    Array(10).fill(0).map((_e, i) => (
                                                        <div className={`transactions-block`} key={i}>
                                                            <div className="transaction-data">
                                                                <div className="details">
                                                                    <div className={`icon ${i % 4 === 0 ? "credit" : "debit"}`}>
                                                                        <i className="fa-solid fa-home"></i>
                                                                    </div>
                                                                    <div className="names">
                                                                        <div className="remarks">
                                                                            Given to Home
                                                                        </div>
                                                                        <div className="category">
                                                                            Home
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="value">
                                                                    <div className="amount">
                                                                        <Currency value={1000} />
                                                                    </div>
                                                                    <div className="created-at">
                                                                        <i className="fa-regular fa-clock"></i> 12-04-2024 10:00:56
                                                                    </div>
                                                                    <div className="transaction-options">
                                                                        <div className="option delete">
                                                                            <i className="fa-regular fa-trash-can "></i><span className="name">Delete</span>
                                                                        </div>
                                                                        <div className="option edit">
                                                                            <i className="fa-regular fa-pen-to-square"></i>Edit
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                            :
                                            <>
                                                {
                                                    Array(10).fill(0).map((_e, i) => (
                                                        <div className={`transactions-block`} key={i}>
                                                            <div className="transaction-data">
                                                                <div className="details">
                                                                    <div className={`icon`}>
                                                                        <i className="fa-solid fa-home"></i>
                                                                    </div>
                                                                    <div className="names">
                                                                        <div className="category">
                                                                            Home
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="value">
                                                                    <div className="amount">
                                                                        <Currency value={1000} />
                                                                    </div>
                                                                    <div className="created-at">
                                                                        <i className="fa-solid fa-sliders"></i> Count : {i + 1}
                                                                    </div>
                                                                    <div className="transaction-options">
                                                                        <div className="option">
                                                                            view <i className="fa-solid fa-angle-right"></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="transactions-data data placeholder-glow">
                        <div className="log-details">
                            <div className="card">
                                <div className="card-body">
                                    <div className="log-block spend">
                                        <div className="icon">
                                            <i className="fa-solid fa-money-bill-trend-up"></i>
                                        </div>
                                        <div className="data">
                                            <div className="details">
                                                <div className="value">
                                                    <Currency value={25000} />
                                                </div>
                                                <div className="name">
                                                    Spends
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="progress-bar" style={{ width: `${25}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="option">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </div>
                                    <div className="log-block estimation">
                                        <div className="icon">
                                            <i className="fa-solid fa-file-invoice"></i>
                                        </div>
                                        <div className="data">
                                            <div className="details">
                                                <div className="value">
                                                    <Currency value={75000} />
                                                </div>
                                                <div className="name">
                                                    Estimation
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="progress-bar" style={{ width: `${75}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="option">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </div>
                                    <div className="log-block income">
                                        <div className="icon">
                                            <i className="fa-solid fa-hand-holding-dollar"></i>
                                        </div>
                                        <div className="data">
                                            <div className="details">
                                                <div className="value">
                                                    <Currency value={100000} />
                                                </div>
                                                <div className="name">
                                                    Income
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="progress-bar" style={{ width: `${90}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="option">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </div>
                                    {/* <div className="log-block">
                                        <div className="icon">
                                            <div className="placeholder col-12"></div>
                                        </div>
                                        <div className="data">
                                            <div className="details">
                                                <div className="value">
                                                    <div className="placeholder col-10"></div>
                                                </div>
                                                <div className="name">
                                                    <div className="placeholder col-6"></div>
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="placeholder col-12"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="option disabled-block">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="category-chart">
                            <div className="card">
                                <div className="card-body">
                                    <HighchartsReact containerProps={{ className: "category-pie-chart" }} highcharts={Highcharts} options={category_pie} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
