import { useEffect, useState } from "react"
import "./Transactions.scss"
import Currency from "../../../components/Currency";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accessibility from "highcharts/modules/accessibility";
import helperService from "../../../services/helper-functions.service";

Accessibility(Highcharts);

export default function Transactions() {

    const [transactions_view, setTransactionsView] = useState("all");
    const [category_pie, updateCategoryPieChart] = useState({});
    const [dummy_loader, updateDummyLoader] = useState(true)
    const [log_data, updateLogData] = useState({
        category: {},
        value: "",
        remarks: ""
    })

    useEffect(() => {
        setCategoryWisePieChart();
        setTimeout(() => {
            updateDummyLoader(false)
        }, 2000)
    }, [])

    function updateTransactionsView() {
        if (transactions_view === "all") {
            setTransactionsView("category_wise")
        } else {
            setTransactionsView("all")
        }
    }

    function addLog(type: string) {
        updateLogData({
            category: {},
            value: "",
            remarks: ""
        })
        $("#transactionLog").offcanvas("show")
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

    function updateLog() {
        console.log('log_data', log_data)
    }

    function allTransactionsTemplate() {
        return <>
            {
                dummy_loader ?
                    <>
                        {
                            Array(10).fill(0).map((_e, i) => (
                                <div className={`transactions-block placeholder-glow`} key={i}>
                                    <div className="transaction-data">
                                        <div className="details">
                                            <div className={`icon`}>
                                                <div className="placeholder"></div>
                                            </div>
                                            <div className="names">
                                                <div className="remarks">
                                                    <div className="placeholder col-6" ></div>
                                                </div>
                                                <div className="category">
                                                    <div className="placeholder col-3" ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="value">
                                            <div className="amount">
                                                <div className="placeholder col-8" ></div>
                                            </div>
                                            <div className="created-at">
                                                <div className="placeholder col-12" ></div>
                                            </div>
                                            <div className="transaction-options disabled-block">
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
            }
        </>
    }

    function categoryWiseTemplate() {
        return <>
            {
                dummy_loader ?
                    <>
                        {
                            Array(10).fill(0).map((_e, i) => (
                                <div className={`transactions-block placeholder-glow`} key={i}>
                                    <div className="transaction-data">
                                        <div className="details">
                                            <div className={`icon`}>
                                                <div className="placeholder"></div>
                                            </div>
                                            <div className="names">
                                                <div className="category">
                                                    <div className="placeholder col-3" ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="value">
                                            <div className="amount">
                                                <div className="placeholder col-8" ></div>
                                            </div>
                                            <div className="created-at">
                                                <div className="placeholder col-12" ></div>
                                            </div>
                                            <div className="transaction-options disabled-block">
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
        </>
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
                                        transactions_view === "all" ? allTransactionsTemplate() : categoryWiseTemplate()
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
                                                    {
                                                        dummy_loader ?
                                                            <div className="placeholder col-8"></div>
                                                            :
                                                            <Currency value={25000} />
                                                    }
                                                </div>
                                                <div className="name">
                                                    Spends
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    {
                                                        dummy_loader ?
                                                            <div className="placeholder col-12"></div>
                                                            :
                                                            <div className="progress-bar" style={{ width: `${25}%` }}></div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`option ${dummy_loader ? "disabled-block" : ""}`} onClick={() => addLog("spend")}>
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
                                                    {
                                                        dummy_loader ?
                                                            <div className="placeholder col-8"></div>
                                                            :
                                                            <Currency value={75000} />
                                                    }
                                                </div>
                                                <div className="name">
                                                    Estimation
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    {
                                                        dummy_loader ?
                                                            <div className="placeholder col-12"></div>
                                                            :
                                                            <div className="progress-bar" style={{ width: `${75}%` }}></div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`option ${dummy_loader ? "disabled-block" : ""}`} onClick={() => addLog("estimation")}>
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
                                                    {
                                                        dummy_loader ?
                                                            <div className="placeholder col-8"></div>
                                                            :
                                                            <Currency value={100000} />
                                                    }
                                                </div>
                                                <div className="name">
                                                    Income
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    {
                                                        dummy_loader ?
                                                            <div className="placeholder col-12"></div>
                                                            :
                                                            <div className="progress-bar" style={{ width: `${90}%` }}></div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`option ${dummy_loader ? "disabled-block" : ""}`} onClick={() => addLog("income")}>
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="category-chart">
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
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="transactionLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Spend Log
                    </div>
                    <div className="options">
                        <div className="option-item close">
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="field-required" htmlFor="">Category</label>
                            <div className="dropdown">
                                {/* dropdown-toggle */}
                                <a className="btn btn-outline-secondary w-100" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {/* Select Category */}
                                    <div className="selected-category">
                                        <div className="category-icon">
                                            <i className="fa-solid fa-home"></i>
                                        </div>
                                        <div className="name">
                                            Home
                                        </div>
                                    </div>
                                </a>
                                <div className="dropdown-menu field-selection">
                                    <div className="field-search">
                                        <input type="text" className="form-control" name="search-text" id="search-text" placeholder="Search Here" />
                                    </div>
                                    <div className="field-data">
                                        {
                                            Array(10).fill(0).map((_e, i) => (
                                                <div className="category-select-block" key={i} role="button">
                                                    <div className={`category-select ${i == 1 ? "active" : ""}`}>
                                                        <div className="category-icon">
                                                            <i className="fa-solid fa-home"></i>
                                                        </div>
                                                        <div className="name">
                                                            Home
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 form-group mt-3">
                        <label className="field-required" htmlFor="value">Value</label>
                        <input type="number" id="value" name="value" className="form-control" placeholder="Enter Value"
                            value={log_data.value} onChange={event => updateLogData({ ...log_data, value: event.target.value })} />
                    </div>
                    <div className="col-12 form-group mt-3">
                        <label className="field-required" htmlFor="">Remarks</label>
                        <input type="text" id="remarks" name="remarks" className="form-control" placeholder="Enter Remarks"
                            value={log_data.remarks} onChange={event => updateLogData({ ...log_data, remarks: event.target.value })} />
                    </div>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas"><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                    </div>
                    <div className="option">
                        <button className="btn btn-success" onClick={updateLog}><i className="fa-regular fa-circle-check"></i> Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
