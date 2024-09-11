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
        { key: "spend", name: "Spend", plural: "Spends", dbKey: "debit" },
        { key: "estimation", name: "Estimation", plural: "Estimations", dbKey: "estimation" },
        { key: "income", name: "Income", plural: "Income", dbKey: "credit" },
    ];
    const typeOtherNames: any = {
        spend: { key: "debit" },
        estimation: { key: "estimation" },
        income: { key: "credit" },
    }
    const [transactionType, updateTransactionType] = useState<any>(transactionsType[0]);
    const [transactionsView, setTransactionsView] = useState("all");
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
    const [loadTransactionLog, updateTransactionLogFlag] = useState(false);
    const [confirmDeleteRecord, updateDeleteRecord] = useState<any>({});
    const [loadDeleteRecord, updateDeleteLoader] = useState(false);
    const [loadCategoryWiseData, updateCategoryWiseLoader] = useState(true);
    const [filteredCategoryWise, updateFilteredCategoryWise] = useState<any[]>([]);
    const [allCategoryWise, updateAllCategoryWise] = useState<any>({});
    const [categoryWisePie, updateCategoryWisePie] = useState({});
    const [validCategoryPie, updateCategoryPieStatus] = useState(false);
    const [selectedSingleCategory, updateSingleCategory] = useState<any>(null);
    const [singleCategoryAllLogs, updateSingleCategoryLogs] = useState<any[]>([]);
    const [singleCategoryFilteredLogs, updateSingleCategoryFilteredLogs] = useState<any[]>([]);
    const [singleCategorySearch, updateSingleCategorySearch] = useState("");
    const [loadSingleCatLog, updateSingleCatLogLoader] = useState(true);


    useEffect(() => {
        setCategoryWisePieChart();
        getDefaultData()
    }, [])

    async function getDefaultData() {
        await getUserCatagories();
        getPageData()
    }

    function getPageData() {
        getUserTransactions();
        getCategoryWiseData();
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
            const data = res.data
            updateAllTransactionsData(res.data)
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
            } catch { }
            updateTransactionsLoader(false)
        }).catch(() => {
            updateAllTransactionsData({});
            updateTransactionTypeData([]);
            updateTransactionsOverallData({})
            updateTransactionsLoader(false);
        })
    }


    useEffect(() => {
        if (transactionsView === "all") {
            updateCurrentTypeTransactions()
        } else {
            setFilteredCategoryWiseData()
        }
    }, [allTransactionsData, transactionsSearch, transactionType])

    useEffect(() => {
        setFilteredCategoryWiseData();
        setCategoryWisePieChart();
    }, [allCategoryWise])

    function updateCurrentTypeTransactions() {
        try {
            let allDayData: any[] = [];
            const typeData = allTransactionsData[transactionType.key].day_wise
            for (let dayWiseData of typeData) {
                allDayData = [...allDayData, ...dayWiseData.data]
            }
            allDayData = allDayData.reverse()
            const data = helperService.filterArrayOnSearch(allDayData, ["remarks"], transactionsSearch)
            updateTransactionTypeData([...data])
        } catch {
            updateTransactionTypeData([])
        }
    }

    function getCategoryWiseData() {
        updateCategoryWiseLoader(true)
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStartTime, "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEndTime, "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getMonthCategoryWise(body).then(res => {
            updateAllCategoryWise(res.data?.data ?? {})
            updateCategoryWiseLoader(false);
        }).catch(() => {
            updateCategoryWiseLoader(false);
            updateCategoryPieStatus(false);
            updateFilteredCategoryWise([]);
        })
    }

    function setFilteredCategoryWiseData() {
        function setData(inputData: any[], categoryData: any = {}) {
            return inputData.map(e => {
                const singleData = categoryData[e._id]
                return {
                    ...e,
                    ...(categoryData[e._id] ? {
                        transactionData: {
                            ...singleData
                        }
                    } : {})
                }
            })
        }
        let selectedTypeData = [];
        if (transactionType.key === "spend") {
            selectedTypeData = setData(spendCategories, allCategoryWise.debits)
        } else if (transactionType.key === "estimation") {
            selectedTypeData = setData(spendCategories, allCategoryWise.estimations)
        } else if (transactionType.key === "income") {
            selectedTypeData = setData(incomeCategories, allCategoryWise.credits)
        }
        try {
            selectedTypeData = selectedTypeData.sort((a, b) => ((a.transactionData?.total ?? 0) < (b.transactionData?.total ?? 0) ? 1 : -1))
        } catch { }
        updateFilteredCategoryWise([...selectedTypeData])
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
            const spendData = allCategoryWise.debits
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

    function updateTransactionsView() {
        if (transactionsView === "all") {
            setTransactionsView("category_wise")
            setFilteredCategoryWiseData()
        } else {
            setTransactionsView("all")
            updateCurrentTypeTransactions()
        }
        updateTransactionsSearch("")
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

    function editLog(data: any) {
        updateLogType(transactionType.key)
        try {
            updateLogForm({
                category: categoriesObject[data.category_id],
                value: data.value,
                remarks: data.remarks,
                oldData: data
            })
            filterLogCategories(transactionType.key)
            updateLogCategorySearch("")
            $("#transactionLog").offcanvas("show")
        } catch {
            toast.error("Unable to set data", { duration: 1500, id: "invalid-log-edit" })
        }
    }

    function submitLog() {
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
        updateTransactionLogFlag(true)
        if (logFormData.oldData) {
            updateLogData()
            return
        }
        const body = {
            category_id: logFormData.category?._id,
            value: Number(logFormData.value),
            remarks: logFormData.remarks
        }
        transactionLogApiService.logTransaction(typeOtherNames[logType].key, body).then(() => {
            toast.success("Log Created", { duration: 1500 })
            updateTransactionLogFlag(false)
            getPageData();
            closeLogCanvas()
        }).catch(e => {
            updateTransactionLogFlag(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })
    }

    function updateLogData() {
        let body: any = {
            ...((logFormData.category?._id !== logFormData.oldData.category_id) ? { category_id: logFormData.category?._id } : {}),
            ...((Number(logFormData.value) !== logFormData.oldData.value) ? { value: Number(logFormData.value) } : {}),
            ...((logFormData.remarks !== logFormData.oldData.remarks) ? { remarks: logFormData.remarks } : {}),
        }
        if (!Object.keys(body).length) {
            toast.error("No Change", { duration: 1500, id: "no-change-in-update" });
            updateTransactionLogFlag(false)
            return
        }
        transactionLogApiService.updateTransaction({ type: typeOtherNames[logType].key, id: logFormData.oldData._id }, body).then(() => {
            toast.success("Log Updated", { duration: 1500 })
            updateTransactionLogFlag(false)
            getPageData();
            closeLogCanvas();
            if (selectedSingleCategory) {
                closeSingleCategoryLog()
            }
        }).catch(e => {
            updateTransactionLogFlag(false)
            toast.error(e?.response?.data?.message ?? `Update Failed`, { duration: 1500 })
        })
    }

    function closeLogCanvas() {
        $("#transactionLog").offcanvas("hide")
        if (selectedSingleCategory) {
            $("#singleCategoryView").offcanvas("show");
        }
    }

    function deleteLog() {
        const body = {
            id: confirmDeleteRecord._id,
            type: transactionType.dbKey
        }
        updateDeleteLoader(true)
        transactionLogApiService.deleteTransaction(body).then(() => {
            toast.success("Record Deleted", { duration: 1500 })
            updateDeleteLoader(false)
            getPageData();
            $("#transactionDeleteConfirm").modal("hide")
            if (selectedSingleCategory) {
                closeSingleCategoryLog()
            }
        }).catch(e => {
            updateDeleteLoader(false)
            toast.error(e?.response?.data?.message ?? `Deletion Failed`, { duration: 1500 })
        })
    }

    function openSingleCategoryLog(selected: any) {
        updateSingleCatLogLoader(true)
        updateSingleCategory(selected)
        updateSingleCategoryLogs([]);
        updateSingleCategorySearch("")
        $("#singleCategoryView").offcanvas("show")
        const body = {
            category_id: selected._id,
            type: transactionType.dbKey,
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStartTime, "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEndTime, "yyyy-MM-DD HH:mm:ss"),
        }
        transactionLogApiService.getMonthSingleCategoryWise(body).then(res => {
            const data = res.data?.data ?? [];
            let logData: any[] = []
            for (let dayItem of data) {
                logData = logData.concat(dayItem.data)
            }
            updateSingleCategoryLogs(logData)
            updateSingleCatLogLoader(false)
        }).catch(() => {
            updateSingleCategoryLogs([])
            updateSingleCatLogLoader(false)
        })
    }

    function closeSingleCategoryLog() {
        updateSingleCategory(null)
        $("#singleCategoryView").offcanvas("hide")
    }

    useEffect(() => {
        setSingleCategoryFilteredData()
    }, [singleCategorySearch, singleCategoryAllLogs])

    function setSingleCategoryFilteredData() {
        try {
            const singleCategoryFilteredLogs = helperService.filterArrayOnSearch(singleCategoryAllLogs, ["remarks"], singleCategorySearch)
            updateSingleCategoryFilteredLogs([...singleCategoryFilteredLogs])
        } catch {
            updateSingleCategoryFilteredLogs([])
        }
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
                                        transactionTypeData.map(transaction => (
                                            <div className={`transactions-block`} key={transaction._id}>
                                                <div className="transaction-data">
                                                    <div className="details">
                                                        <div className={`icon ${transactionType.key === "income" ? "credit" : (transactionType.key === "estimation" ? "estimation" : "debit")}`}>
                                                            <i className={categoriesObject[transaction.category_id]?.icon}></i>
                                                        </div>
                                                        <div className="names">
                                                            <div className="remarks">
                                                                {transaction.remarks}
                                                            </div>
                                                            <div className="category">
                                                                {categoriesObject[transaction.category_id]?.name ?? "----"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="value">
                                                        <div className="amount">
                                                            <Currency value={transaction.value} />
                                                        </div>
                                                        <div className="created-at">
                                                            <i className="fa-regular fa-clock"></i> {timeConversionsService.convertUtcDateTimeToLocal(transaction.created_at, "DD-MM-YYYY HH:mm:ss") as string}
                                                        </div>
                                                        <div className="transaction-options">
                                                            <div className="option delete" data-bs-toggle="modal" data-bs-target="#transactionDeleteConfirm" onClick={() => {
                                                                updateDeleteRecord(transaction)
                                                            }}>
                                                                <i className="fa-regular fa-trash-can "></i><span className="name">Delete</span>
                                                            </div>
                                                            <div className="option edit" onClick={() => editLog(transaction)}>
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

    function singleCategoryLogTemplate() {
        return <>
            {
                loadSingleCatLog ?
                    allTransactionsLoaderTemplate()
                    :
                    <>
                        {
                            singleCategoryFilteredLogs.length ?
                                <>
                                    {
                                        singleCategoryFilteredLogs.map(transaction => (
                                            <div className={`transactions-block`} key={transaction._id}>
                                                <div className="transaction-data">
                                                    <div className="details">
                                                        <div className={`icon ${transactionType.key === "income" ? "credit" : (transactionType.key === "estimation" ? "estimation" : "debit")}`}>
                                                            <i className={categoriesObject[transaction.category_id]?.icon}></i>
                                                        </div>
                                                        <div className="names">
                                                            <div className="remarks">
                                                                {transaction.remarks}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="value">
                                                        <div className="amount">
                                                            <Currency value={transaction.value} />
                                                        </div>
                                                        <div className="created-at">
                                                            <i className="fa-regular fa-clock"></i> {timeConversionsService.convertUtcDateTimeToLocal(transaction.created_at, "DD-MM-YYYY HH:mm:ss") as string}
                                                        </div>
                                                        <div className="transaction-options">
                                                            <div className="option delete" data-bs-toggle="modal" data-bs-target="#transactionDeleteConfirm" onClick={() => {
                                                                updateDeleteRecord(transaction)
                                                            }}>
                                                                <i className="fa-regular fa-trash-can "></i><span className="name">Delete</span>
                                                            </div>
                                                            <div className="option edit" onClick={() => {
                                                                $("#singleCategoryView").offcanvas("hide");
                                                                editLog(transaction)
                                                            }}>
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
                                    <NoData title="No Data" text={singleCategorySearch ? "No Search results" : "No transactions in this month"} />
                                </div>
                        }
                    </>
            }
        </>
    }

    function categoryWiseLoaderTemplate() {
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
    }

    function categoryWiseTemplate() {
        return <>
            {
                loadCategoryWiseData ?
                    categoryWiseLoaderTemplate()
                    :
                    <>
                        {
                            filteredCategoryWise.length ?
                                <>
                                    {
                                        filteredCategoryWise.map(categoryItem => (
                                            <div className={`transactions-block`} key={categoryItem._id}>
                                                <div className="transaction-data">
                                                    <div className="details">
                                                        <div className={`icon ${transactionType.key === "income" ? "credit" : (transactionType.key === "estimation" ? "estimation" : "debit")}`}>
                                                            <i className={categoryItem.icon}></i>
                                                        </div>
                                                        <div className="names">
                                                            <div className="category">
                                                                {categoryItem.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="value">
                                                        <div className="amount">
                                                            <Currency value={categoryItem.transactionData?.total ?? 0} />
                                                        </div>
                                                        <div className="created-at">
                                                            <i className="fa-solid fa-sliders"></i> Count : {categoryItem.transactionData?.count ?? 0}
                                                        </div>
                                                        <div className="transaction-options">
                                                            <div className={`option ${!categoryItem.transactionData?.total ? "disabled-block" : ""}`} onClick={() => openSingleCategoryLog(categoryItem)}>
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
                                <div className="centred-block-full-height">
                                    <NoData title="No Data" text="No Category Data" />
                                </div>
                        }

                    </>
            }
        </>
    }

    return (
        <>
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
                                                                        updateTransactionsSearch("")
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
                                                {transactionsView === "all" ? "This Month" : "Category Wise"} {transactionType.plural}
                                            </div>
                                        </div>
                                        <div className="options" onClick={updateTransactionsView}>
                                            {
                                                transactionsView === "all" ?
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
                                    {transactionsView === "all" &&
                                        <div className="search form-group">
                                            <input type="text" id="tra-search" name="tra-search" className="form-control" placeholder="Search Transactions"
                                                value={transactionsSearch} onChange={(e => {
                                                    updateTransactionsSearch(e.target.value)
                                                })} />
                                        </div>
                                    }
                                </div>
                                <div className={`body ${transactionsView === "category_wise" ? "no-search" : ""}`}>
                                    {
                                        transactionsView === "all" ? allTransactionsTemplate() : categoryWiseTemplate()
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
                                        loadCategoryWiseData ?
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
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} id="transactionLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        {transformationService.titleCase(logType)} Log
                    </div>
                    <div className="options">
                        <div className={`option-item close ${loadTransactionLog ? "disabled-block" : ""}`}>
                            <i className="fa-solid fa-xmark" onClick={closeLogCanvas}></i>
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
                        <button className="btn btn-outline-secondary" disabled={loadTransactionLog} onClick={closeLogCanvas}><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                    </div>
                    <div className="option">
                        {
                            loadTransactionLog ?
                                <button className="btn btn-success" disabled><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Loading...</button>
                                :
                                <button className="btn btn-success" onClick={submitLog}><i className="fa-regular fa-circle-check"></i> Submit</button>
                        }
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} id="singleCategoryView" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Category Wise Log
                    </div>
                    <div className="options">
                        <div className="option-item close">
                            <i className="fa-solid fa-xmark" onClick={closeSingleCategoryLog}></i>
                        </div>
                    </div>
                </div>
                {
                    selectedSingleCategory &&
                    <div className="offcanvas-body">
                        <div className="single-category">
                            <div className="overall-data">
                                <div className="category">
                                    <div className={`transactions-block`}>
                                        <div className="transaction-data">
                                            <div className="details">
                                                <div className={`icon`}>
                                                    <i className={selectedSingleCategory.icon}></i>
                                                </div>
                                                <div className="names">
                                                    <div className="category">
                                                        {selectedSingleCategory.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="value">
                                                <div className="amount">
                                                    <Currency value={selectedSingleCategory.transactionData?.total ?? 0} />
                                                </div>
                                                <div className="created-at">
                                                    <i className="fa-solid fa-sliders"></i> Count : {selectedSingleCategory.transactionData?.count ?? 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="search form-group">
                                    <input type="text" id="singe-cat-tra-search" name="singe-cat-tra-search" className="form-control" placeholder="Search Transactions"
                                        value={singleCategorySearch} onChange={(e => {
                                            updateSingleCategorySearch(e.target.value)
                                        })} />
                                </div>
                            </div>
                            <div className="single-category-log">
                                {singleCategoryLogTemplate()}
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className="modal fade" id="transactionDeleteConfirm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="confirmation-modal">
                            <div className="icon">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <div className="text">
                                Are you sure, You want Delete this record?
                            </div>
                            <div className="confirmation-footer">
                                <div className="option">
                                    <button className="btn btn-secondary" data-bs-dismiss="modal" disabled={loadDeleteRecord}>Cancel</button>
                                </div>
                                <div className="option">
                                    {
                                        loadDeleteRecord ?
                                            <button className="btn btn-ft-outline-primary" disabled><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Deleting...</button>
                                            :
                                            <button className="btn btn-ft-outline-primary" onClick={deleteLog}>Delete</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
