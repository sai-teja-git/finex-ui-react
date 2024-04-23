import { useEffect, useState } from "react";
import Currency from "../../../components/Currency";

export default function SingleBillGroup() {

    const [dummyLoader, updateDummyLoader] = useState(true);
    const [overall_card_details, setOverallCardDetails] = useState<Record<string, any>>({});
    const [billLogData, updateBillLogData] = useState<any>({});

    useEffect(() => {
        setTimeout(() => {
            updateDummyLoader(false)
        }, 1000)
    }, [])

    function openBillLog() {
        $("#billLog").offcanvas("show")
    }

    function openSinglePersonBill() {
        $("#viewPersonBill").offcanvas("show")
    }

    function singleGroupOverallTemplate() {
        return <>
            <div className={`overview ${dummyLoader && "placeholder-glow"}`} >
                <div className="overview-block estimation">
                    <div className="block-left">
                        <div className="amount">
                            {
                                dummyLoader ? <span className="placeholder col-10"></span> :
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
                <div className="overview-block spend">
                    <div className="block-left">
                        <div className="amount">
                            {
                                dummyLoader ? <span className="placeholder col-10"></span> :
                                    <Currency value={overall_card_details["total_spends"] ? overall_card_details["total_spends"] : 0} />
                            }
                        </div>
                        <div className="name">
                            Actual
                        </div>
                    </div>
                    <div className="block-right">
                        <div className="icon">
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                    </div>
                </div>
                <div className="overview-block income">
                    <div className="block-left">
                        <div className="amount">
                            {
                                dummyLoader ? <span className="placeholder col-10"></span> :
                                    <Currency value={overall_card_details["total_income"] ? overall_card_details["total_income"] : 0} />
                            }
                        </div>
                        <div className="name">
                            Paid
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
                                dummyLoader ? <span className="placeholder col-10"></span> : 0
                            }
                        </div>
                        <div className="name">
                            Persons
                        </div>
                    </div>
                    <div className="block-right">
                        <div className="icon">
                            <i className="fa-solid fa-solid fa-user"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    return <>
        <div className="row m-0">
            <div className="col-12 p-0">
                <div className="card-body">
                    {singleGroupOverallTemplate()}
                </div>
            </div>
        </div>
        <div className="single-group-details">
            <div className="group-transactions-block left">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            Bills
                        </div>
                        <div className="card-options">
                            <button className="btn btn-outline-secondary btn-sm" onClick={openBillLog} disabled={dummyLoader}><i className="fa-solid fa-plus"></i> Add Bill</button>
                        </div>
                    </div>
                    <div className="card-body">
                        {
                            dummyLoader ?
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
                                                        <div className={`icon`}>
                                                            <i className="fa-regular fa-money-bill-1"></i>
                                                        </div>
                                                        <div className="names">
                                                            <div className="remarks">
                                                                Transport
                                                            </div>
                                                            <div className="category">
                                                                Shared By : {i + 1}
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
                    </div>
                </div>
            </div>
            <div className="group-transactions-block right">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            Person Wise
                        </div>
                        <div className="card-options">
                            <button className="btn btn-outline-secondary btn-sm" disabled={dummyLoader}><i className="fa-solid fa-plus"></i> Add Persons</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="person-data-block">
                            {
                                dummyLoader ?
                                    Array(10).fill(0).map((_e, i) => (
                                        <div className="person-data-item" key={i}>
                                            <div className="user-block">
                                                <div className="icon">
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <div className="person-name loading">
                                                    <div className="placeholder col-8" ></div>
                                                </div>
                                            </div>
                                            <div className="value-block">
                                                <div className="value-item actual">
                                                    <div className="name">
                                                        Total
                                                    </div>
                                                    <div className="currency-value loading">
                                                        <div className="placeholder col-12" ></div>
                                                    </div>
                                                </div>
                                                <div className="value-item paid">
                                                    <div className="name">
                                                        Paid
                                                    </div>
                                                    <div className="currency-value loading">
                                                        <div className="placeholder col-12" ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="view-more disabled-block">
                                                <div className="dropdown dropstart fnx-dropdown">
                                                    <div className="more-option">
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    Array(10).fill(0).map((_e, i) => (
                                        <div className="person-data-item" key={i}>
                                            <div className="user-block">
                                                <div className="icon" style={{ "--fill-percentage": `${i == 0 ? 50 : (i == 3 ? 75 : 0)}%` } as React.CSSProperties}>
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <div className="person-name">
                                                    User-1
                                                </div>
                                            </div>
                                            <div className="value-block">
                                                <div className="value-item actual">
                                                    <div className="name">
                                                        Total
                                                    </div>
                                                    <div className="currency-value">
                                                        <Currency value={10000} />
                                                    </div>
                                                </div>
                                                <div className="value-item paid">
                                                    <div className="name">
                                                        Paid
                                                    </div>
                                                    <div className="currency-value">
                                                        <Currency value={10000} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="view-more">
                                                <div className="dropdown dropstart fnx-dropdown">
                                                    <div className="more-option" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                        <ul className="dropdown-menu">
                                                            <li><a className="dropdown-item">Add Bill</a></li>
                                                            <li><a className="dropdown-item" onClick={openSinglePersonBill}>View</a></li>
                                                            <li><a className="dropdown-item" onClick={openSinglePersonBill}>Edit</a></li>
                                                            <li><a className="dropdown-item">Delete</a></li>
                                                        </ul>
                                                    </div>
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

        <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="billLog" aria-labelledby="staticBackdropLabel">
            <div className="offcanvas-header border-bottom">
                <div className="title">
                    Add New Bill
                </div>
                <div className="options">
                    <div className="option-item close">
                        <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                    </div>
                </div>
            </div>
            <div className="offcanvas-body">
                <div className="bill-log-form">
                    <div className="row">
                        <div className="col-12 form-group">
                            <div className="bill-value">
                                <div className="value-field">
                                    <label className="field-required" htmlFor="value">Value</label>
                                    <input type="number" id="value" name="value" className="form-control" placeholder="Enter Value"
                                        value={billLogData.value} onChange={event => updateBillLogData({ ...billLogData, value: event.target.value })} />
                                </div>
                                <div className="value-split">
                                    <button className="btn btn-outline-secondary">Split Evenly</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 form-group mt-3">
                            <label className="field-required" htmlFor="bill-name">Name</label>
                            <input type="text" id="bill-name" name="bill-name" className="form-control" placeholder="Enter Bill Name"
                                value={billLogData.name} onChange={event => updateBillLogData({ ...billLogData, name: event.target.value })} />
                        </div>
                    </div>

                    <div className="warning-box mt-3">
                        <i className="fa-solid fa-triangle-exclamation"></i>Split amount exceeds expense amount by
                        <div className="d-flex justify-content-center">
                            <Currency value={100} />
                        </div>
                    </div>

                    <div className="person-selection-block mt-4">
                        <div className="header">
                            <div className="select-all">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="all" />
                                </div>
                                <div className="name">
                                    All
                                </div>
                            </div>
                            <div className="search-bar">
                                <input type="text" name="search-persons" id="search-persons" className="form-control" placeholder="Search Persons" />
                            </div>
                        </div>
                        <div className="body">
                            {
                                Array(8).fill(0).map((_e, i) => (
                                    <div className="user-block" key={i}>
                                        <div className="user-details">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id={"all" + i} />
                                            </div>
                                            <div className="name">
                                                Person-{i + 1}
                                            </div>
                                        </div>
                                        <div className="options">
                                            <div className="value">
                                                <input type="number" id={"person-value" + i} name={"person-value" + i} className="form-control" placeholder="value" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas-footer end">
                <div className="option">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas"><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                </div>
                <div className="option">
                    <button className="btn btn-success" ><i className="fa-regular fa-circle-check"></i> Submit</button>
                </div>
            </div>
        </div>

        <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="viewPersonBill" aria-labelledby="staticBackdropLabel">
            <div className="offcanvas-header border-bottom">
                <div className="title">
                    Mani Bills
                </div>
                <div className="options">
                    <div className="option-item close">
                        <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                    </div>
                </div>
            </div>
            <div className="offcanvas-body">
                <div className="person-overall-data-block">
                    <div className="person-value-item">
                        <div className="name">
                            Total
                        </div>
                        <div className="value">
                            <Currency value={150000} />
                        </div>
                    </div>
                    <div className="person-value-item">
                        <div className="name">
                            Paid till now
                        </div>
                        <div className="value">
                            <Currency value={50000} />
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 form-group">
                        <label htmlFor="amount-paid-now">Amount paid now</label>
                        <input type="number" id="amount-paid-now" name="amount-paid-now" className="form-control" placeholder="value" />
                    </div>
                </div>
                <div className="person-share-bills">
                    {
                        Array(10).fill(0).map((_e, i) => (
                            <div className="share-bill-block" key={i}>
                                <div className="name">
                                    <i className="fa-solid fa-file-invoice"></i>Bill name-{i + 1}
                                </div>
                                <div className="value-block">
                                    <div className="bill-value">
                                        <div className="value-title">Total</div>
                                        <div className="data-value">
                                            <Currency value={10000} />
                                        </div>
                                    </div>
                                    <div className="bill-value">
                                        <div className="value-title">Share</div>
                                        <div className="data-value">
                                            <Currency value={5000} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="offcanvas-footer end">
                <div className="option">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas"><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                </div>
                <div className="option">
                    <button className="btn btn-outline-secondary"><i className="fa-regular fa-pen-to-square"></i> Edit</button>
                </div>
                <div className="option">
                    <button className="btn btn-success" ><i className="fa-regular fa-circle-check"></i> Submit</button>
                </div>
            </div>
        </div>
    </>
}
