import { useEffect, useState } from "react"
import "./Transactions.scss"
import Currency from "../../../components/Currency";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Accessibility from "highcharts/modules/accessibility";
import helperService from "../../../services/helper-functions.service";
import catagoriesApiService from "../../../api/categories.api.service";
import timeConversionsService from "../../../services/time-conversions.service";
import transactionLogApiService from "../../../api/transaction-log.api.service";
import NoData from "../../../components/NoData";
import transformationService from "../../../services/transformations.service";
import toast from "react-hot-toast";

Accessibility(Highcharts);

export default function Transactions() {

    const monthStartTime = new Date(timeConversionsService.dateTimeFormat(new Date(), "YYYY-MM-01 00:00:00"));
    const monthEndTime = new Date(monthStartTime.getFullYear(), monthStartTime.getMonth() + 1, 1);
    const transactionsType: any[] = [
        { key: "spend", name: "Spend", plural: "Spends" },
        { key: "estimation", name: "Estimation", plural: "Estimations" },
        { key: "income", name: "Income", plural: "Income" },
    ];
    const typeOtherNames: any = {
        spend: { key: "debit" },
        estimation: { key: "estimation" },
        income: { key: "credit" },
    }
    const [transactionType, updateTransactionType] = useState<any>(transactionsType[0]);
    const [transactions_view, setTransactionsView] = useState("all");
    const [spendCategories, updateSpendCategories] = useState<any[]>([]);
    const [incomeCategories, updateIncomeCategories] = useState<any[]>([]);
    const [categoriesObject, updateCategoriesObject] = useState<any>({});
    const [loadTransactions, updateTransactionsLoader] = useState<boolean>(true);
    const [allTransactionsData, updateAllTransactionsData] = useState<any>({});
    const [transactionTypeData, updateTransactionTypeData] = useState<any[]>([]);
    const [transactionsSearch, updateTransactionsSearch] = useState("");
    const [transactionsOverallData, updateTransactionsOverallData] = useState<any>({});
    const [logType, updateLogType] = useState("");
    const [filteredCategories, updateFilteredCategories] = useState<any[]>([]);
    const [logCategorySearch, updateLogCategorySearch] = useState("");
    const [logFormData, updateLogForm] = useState<any>({
        category: null,
        value: "",
        remarks: ""
    })
    const [loadTransactionLog, updateTransactionLogFlag] = useState(false)


    const [category_pie, updateCategoryPieChart] = useState({});
    const [dummy_loader, updateDummyLoader] = useState(true)

    useEffect(() => {
        setCategoryWisePieChart();
        getDefaultData()
    }, [])

    async function getDefaultData() {
        await getUserCatagories();
        getPageData()
    }

    function getPageData() {
        getUserTransactions()
    }

    async function getUserCatagories() {
        await catagoriesApiService.getUserCategories().then(res => {
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
            updateSpendCategories([]);
            updateIncomeCategories([]);
            updateCategoriesObject({})
        })
    }

    function getUserTransactions() {
        updateTransactionsLoader(true)
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStartTime, "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEndTime, "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getOverallLogs(body).then(res => {
            console.log('res.data', res.data)
            const data = res.data
            try {
                const base = Math.max(data.spend.total, data.income.total, data.estimation.total);
                const overallData = {
                    spend: {
                        value: data.spend.total,
                        percentage: helperService.calculatePercentage(data.spend.total, base)
                    },
                    income: {
                        value: data.income.total,
                        percentage: helperService.calculatePercentage(data.income.total, base)
                    },
                    estimation: {
                        value: data.estimation.total,
                        percentage: helperService.calculatePercentage(data.estimation.total, base)
                    }
                }
                updateTransactionsOverallData(overallData)
                console.log('overallData', overallData)
            } catch { }
            updateTransactionsLoader(false)
        }).catch(() => {
            updateAllTransactionsData({});
            updateTransactionTypeData([]);
            updateTransactionsOverallData({})
            updateTransactionsLoader(false);
        })
    }

    function updateTransactionsView() {
        if (transactions_view === "all") {
            setTransactionsView("category_wise")
        } else {
            setTransactionsView("all")
        }
    }

    useEffect(() => {
        filterLogCategories()
    }, [logCategorySearch])

    function filterLogCategories(type = logType) {
        if (type === "spend" || type === "estimation") {
            const categories = helperService.filterArrayOnSearch(spendCategories, ["name"], logCategorySearch)
            updateFilteredCategories([...categories])
        } else if (type === "income") {
            const categories = helperService.filterArrayOnSearch(incomeCategories, ["name"], logCategorySearch)
            updateFilteredCategories([...categories])
        } else {
            updateFilteredCategories([])
        }
    }

    function addLog(type: string) {
        updateLogType(type)
        updateLogForm({
            category: null,
            value: "",
            remarks: ""
        })
        filterLogCategories(type)
        updateLogCategorySearch("")
        $("#transactionLog").offcanvas("show")
    }

    function submitLog() {
        console.log('logFormData', logFormData)
        try {
            if (!logFormData.value || !logFormData.remarks || !logFormData.category) {
                throw new Error("Please fill the required fields")
            }
            if (!Object.keys(logFormData.category).length) {
                throw new Error("Please fill the required fields")
            }
            if (logFormData.value < 0) {
                throw new Error("Value should not be negative")
            }
        } catch (e: any) {
            toast.error(e.message ?? "Creation Failed", { duration: 2500, id: "invalid-category-create" })
            return
        }
        const body = {
            category_id: logFormData.category?._id,
            value: Number(logFormData.value),
            remarks: logFormData.remarks
        }
        updateTransactionLogFlag(true)
        transactionLogApiService.logTransaction(typeOtherNames[logType].key, body).then(() => {
            toast.success("Log Created", { duration: 1500 })
            updateTransactionLogFlag(false)
            getPageData();
            $("#transactionLog").offcanvas("hide")
        }).catch(e => {
            updateTransactionLogFlag(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })
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

    function allTransactionsLoaderTemplate() {
        return <>
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
    }

    function allTransactionsTemplate() {
        return <>
            {
                loadTransactions ?
                    allTransactionsLoaderTemplate()
                    :
                    <>
                        {
                            transactionTypeData.length ?
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
                                <div className="centred-block-full-height">
                                    <NoData title="No Data" text="No transactions in this month" />
                                </div>
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
                                                <div className="option" >
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
                                            <div className="title-data">
                                                Transactions <div className="dropdown fnx-dropdown">
                                                    <div className="more-option" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
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
                                            <div className="sub-title">
                                                {transactions_view === "all" ? "This Month" : "Category Wise"} {transactionType.plural}
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
                                                        loadTransactions ?
                                                            <div className="placeholder col-8"></div>
                                                            :
                                                            <Currency value={transactionsOverallData?.spend?.value ?? 0} />
                                                    }
                                                </div>
                                                <div className="name">
                                                    Spends
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    {
                                                        loadTransactions ?
                                                            <div className="placeholder col-12"></div>
                                                            :
                                                            <div className="progress-bar" style={{ width: `${transactionsOverallData?.spend?.percentage ?? 0}%` }}></div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`option ${loadTransactions ? "disabled-block" : ""}`} onClick={() => addLog("spend")}>
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
                                                        loadTransactions ?
                                                            <div className="placeholder col-8"></div>
                                                            :
                                                            <Currency value={transactionsOverallData?.estimation?.value ?? 0} />
                                                    }
                                                </div>
                                                <div className="name">
                                                    Estimation
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    {
                                                        loadTransactions ?
                                                            <div className="placeholder col-12"></div>
                                                            :
                                                            <div className="progress-bar" style={{ width: `${transactionsOverallData?.estimation?.percentage ?? 0}%` }}></div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`option ${loadTransactions ? "disabled-block" : ""}`} onClick={() => addLog("estimation")}>
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
                                                        loadTransactions ?
                                                            <div className="placeholder col-8"></div>
                                                            :
                                                            <Currency value={transactionsOverallData?.income?.value ?? 0} />
                                                    }
                                                </div>
                                                <div className="name">
                                                    Income
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    {
                                                        loadTransactions ?
                                                            <div className="placeholder col-12"></div>
                                                            :
                                                            <div className="progress-bar" style={{ width: `${transactionsOverallData?.income?.percentage ?? 0}%` }}></div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`option ${loadTransactions ? "disabled-block" : ""}`} onClick={() => addLog("income")}>
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
                        {transformationService.titleCase(logType)} Log
                    </div>
                    <div className="options">
                        <div className={`option-item close ${loadTransactionLog ? "disabled-block" : ""}`}>
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="field-required">Category</label>
                            <div className={`dropdown ${loadTransactionLog ? "disabled-block" : ""}`}>
                                <a className="btn btn-outline-secondary w-100" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => {
                                    updateLogCategorySearch("")
                                }}>
                                    {
                                        logFormData.category?.name ?
                                            <div className="selected-category">
                                                <div className="category-icon">
                                                    <i className={logFormData.category?.icon}></i>
                                                </div>
                                                <div className="name">
                                                    {logFormData.category?.name}
                                                </div>
                                            </div>
                                            :
                                            "Select Category"
                                    }
                                </a>
                                <div className="dropdown-menu field-selection">
                                    <div className="field-search">
                                        <input type="text" className="form-control" name="search-text" id="search-text" placeholder="Search Here" value={logCategorySearch} onChange={(e) => {
                                            updateLogCategorySearch(e.target.value)
                                        }} />
                                    </div>
                                    <div className="field-data">
                                        {
                                            filteredCategories.map(category => (
                                                <div className="category-select-block" key={category._id} role="button">
                                                    <div className={`category-select ${logFormData.category?._id == category._id ? "active" : ""}`} onClick={() => {
                                                        updateLogForm({ ...logFormData, category })
                                                    }}>
                                                        <div className="category-icon">
                                                            <i className={category.icon}></i>
                                                        </div>
                                                        <div className="name">
                                                            {category.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {
                                            !filteredCategories.length &&
                                            <NoData text={logCategorySearch ? "No search results" : "No Data"} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 form-group mt-3">
                            <label className="field-required" htmlFor="value">Value</label>
                            <input type="number" id="value" name="value" className="form-control" placeholder="Enter Value" disabled={loadTransactionLog}
                                value={logFormData.value} onChange={event => updateLogForm({ ...logFormData, value: event.target.value })} />
                        </div>
                        <div className="col-12 form-group mt-3">
                            <label className="field-required" htmlFor="remarks">Remarks</label>
                            <input type="text" id="remarks" name="remarks" className="form-control" placeholder="Enter Remarks" disabled={loadTransactionLog}
                                value={logFormData.remarks} onChange={event => updateLogForm({ ...logFormData, remarks: event.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas" disabled={loadTransactionLog}><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                    </div>
                    <div className="option">
                        <button className="btn btn-success" disabled={loadTransactionLog} onClick={submitLog}><i className="fa-regular fa-circle-check"></i> Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
