import { useState } from "react"
import "../../assets/css/pages/Transactions.scss"
import Currency from "../../components/Currency"

export default function Transactions() {

    const [transactions_view, setTransactionsView] = useState("all")

    function updateTransactionsView() {
        if (transactions_view === "all") {
            setTransactionsView("category_wise")
        } else {
            setTransactionsView("all")
        }
    }

    return (
        <>
            {/* <NoData title="No Data" text={"Data not available for the page"} /> */}
            <div className="page-body no-header">
                <div className="transactions-page">
                    <div className="transactions-data log">
                        <div className="card">
                            <div className="card-body">
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
                                <div className="body">
                                    {
                                        transactions_view === "all" ?
                                            <>
                                                {
                                                    Array(10).fill(0).map((e, i) => (
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
                                                    Array(10).fill(0).map((e, i) => (
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
                    <div className="transactions-data data">
                        <div className="card">
                            <div className="card-body"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="row m-0">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            Transactions
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12"></div>
            </div> */}
        </>
    )
}
