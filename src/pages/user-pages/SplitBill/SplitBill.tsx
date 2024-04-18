import { useEffect, useState } from "react";
import "./SplitBill.scss";
import MonthPicker from "../../../components/MonthPicker/MonthPicker";
import moment from "moment-timezone";
import Currency from "../../../components/Currency";
import { v4 as uuidv4 } from 'uuid';

export default function SplitBill() {
    const [selectedMonth, updateAnalysisMonth] = useState(moment());
    const [pageViewType, updatePageView] = useState("overallData");
    const [dummyLoader, updateDummyLoader] = useState(true);
    const [groupFormData, updateGroupFormData] = useState<any>(createNewPersonObj());
    const [selectedGroupToView, updateSelectedViewGroup] = useState<any>({});
    const [overall_card_details, setOverallCardDetails] = useState<Record<string, any>>({});

    useEffect(() => {
        setTimeout(() => {
            updateDummyLoader(false)
        }, 1500)
    }, [])

    function monthUpdated(event: any): any {
        console.warn("called mo", event);
        updateAnalysisMonth(event.value)
    }

    function openGroupForm() {
        updateGroupFormData(createNewPersonObj())
        console.log('groupFormData', groupFormData)
        $("#groupLog").offcanvas("show")
    }

    function createNewPersonObj() {
        return {
            persons: [{
                id: uuidv4()
            }]
        }
    }

    function createNewGroup() {
        console.log('groupFormData', groupFormData)
    }

    function openSingleGroupData(selected: any) {
        updateSelectedViewGroup({ title: "Trip to city" })
        updatePageView("singleGroup")
    }

    function openOverallData() {
        updatePageView("overallData")
    }

    function overallDataTemplate() {
        return <>
            <div className="overall-bill-data placeholder-glow">
                {
                    dummyLoader ?
                        Array(6).fill(0).map((_e, i) => (
                            <div className="bill-block" key={i}>
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">
                                            <div className="placeholder col-12"></div>
                                        </div>
                                        <div className="card-options">
                                            <div className="dropdown fnx-dropdown disabled-block">
                                                <div className="more-option" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="log-block estimation">
                                            <div className="icon">
                                                <i className="fa-solid fa-file-invoice"></i>
                                            </div>
                                            <div className="data">
                                                <div className="details">
                                                    <div className="value">
                                                        {
                                                            dummyLoader ?
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
                                                            dummyLoader ?
                                                                <div className="placeholder col-12"></div>
                                                                :
                                                                <div className="progress-bar" style={{ width: `${75}%` }}></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="log-block actual">
                                            <div className="icon">
                                                <i className="fa-solid fa-receipt"></i>
                                            </div>
                                            <div className="data">
                                                <div className="details">
                                                    <div className="value">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-8"></div>
                                                                :
                                                                <Currency value={25000} />
                                                        }
                                                    </div>
                                                    <div className="name">
                                                        Actual
                                                    </div>
                                                </div>
                                                <div className="log-progress">
                                                    <div className="progress">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-12"></div>
                                                                :
                                                                <div className="progress-bar" style={{ width: `${25}%` }}></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="log-block paid">
                                            <div className="icon">
                                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                            </div>
                                            <div className="data">
                                                <div className="details">
                                                    <div className="value">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-8"></div>
                                                                :
                                                                <Currency value={100000} />
                                                        }
                                                    </div>
                                                    <div className="name">
                                                        Paid
                                                    </div>
                                                </div>
                                                <div className="log-progress">
                                                    <div className="progress">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-12"></div>
                                                                :
                                                                <div className="progress-bar" style={{ width: `${90}%` }}></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        Array(10).fill(0).map((_e, i) => (
                            <div className="bill-block" key={i}>
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">
                                            Trip to city
                                        </div>
                                        <div className="card-options">
                                            <div className="option">
                                                <div className="dropdown fnx-dropdown">
                                                    <div className="more-option" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                        <ul className="dropdown-menu">
                                                            <li><a className="dropdown-item" onClick={() => openSingleGroupData({})}>View</a></li>
                                                            <li><a className="dropdown-item">Edit</a></li>
                                                            <li><a className="dropdown-item">Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="log-block estimation">
                                            <div className="icon">
                                                <i className="fa-solid fa-file-invoice"></i>
                                            </div>
                                            <div className="data">
                                                <div className="details">
                                                    <div className="value">
                                                        {
                                                            dummyLoader ?
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
                                                            dummyLoader ?
                                                                <div className="placeholder col-12"></div>
                                                                :
                                                                <div className="progress-bar" style={{ width: `${75}%` }}></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="log-block actual">
                                            <div className="icon">
                                                <i className="fa-solid fa-receipt"></i>
                                            </div>
                                            <div className="data">
                                                <div className="details">
                                                    <div className="value">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-8"></div>
                                                                :
                                                                <Currency value={25000} />
                                                        }
                                                    </div>
                                                    <div className="name">
                                                        Actual
                                                    </div>
                                                </div>
                                                <div className="log-progress">
                                                    <div className="progress">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-12"></div>
                                                                :
                                                                <div className="progress-bar" style={{ width: `${25}%` }}></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="log-block paid">
                                            <div className="icon">
                                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                            </div>
                                            <div className="data">
                                                <div className="details">
                                                    <div className="value">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-8"></div>
                                                                :
                                                                <Currency value={100000} />
                                                        }
                                                    </div>
                                                    <div className="name">
                                                        Paid
                                                    </div>
                                                </div>
                                                <div className="log-progress">
                                                    <div className="progress">
                                                        {
                                                            dummyLoader ?
                                                                <div className="placeholder col-12"></div>
                                                                :
                                                                <div className="progress-bar" style={{ width: `${90}%` }}></div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>
        </>
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

    function singleBillTemplate() {
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
                                <button className="btn btn-outline-secondary btn-sm"><i className="fa-solid fa-plus"></i> Add Bill</button>
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
                                <button className="btn btn-outline-secondary btn-sm"><i className="fa-solid fa-plus"></i> Add Persons</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="person-data-block">
                                {
                                    Array(10).fill(0).map((_e, i) => (
                                        <div className="person-data-item" key={i}>
                                            <div className="user-block">
                                                <div className="icon">
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
                                                            <li><a className="dropdown-item">View</a></li>
                                                            <li><a className="dropdown-item">Edit</a></li>
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
        </>
    }

    return (
        <>
            <div className="page-header">
                <div className="page-title">
                    Split Bill {pageViewType !== "overallData" && selectedGroupToView.title ? <span className="title-suffix">({selectedGroupToView.title})</span> : ""}
                </div>
                <div className={`page-options`}>
                    {
                        pageViewType === "overallData" ?
                            <>
                                <div className="option">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={openGroupForm}><i className="fa-solid fa-plus"></i> Create New</button>
                                </div>
                                <div className="option">
                                    <MonthPicker id="analysis-month-picker" maxDate={moment()} value={selectedMonth} monthSelected={monthUpdated} />
                                </div>
                            </>
                            :
                            <>
                                <div className="option">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={openOverallData}><i className="fa-solid fa-chevron-left"></i> Back</button>
                                </div>
                            </>
                    }
                </div>
            </div>
            <div className="page-body">
                {
                    pageViewType === "overallData" ? overallDataTemplate() : singleBillTemplate()
                }
            </div>
            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="groupLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Create New Group
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
                            <label className="field-required" htmlFor="title-enter">Title</label>
                            <input type="text" id="title-enter" name="title-enter" className="form-control" placeholder="Enter Title"
                                value={groupFormData.title} onChange={event => updateGroupFormData({ ...groupFormData, title: event.target.value })} />
                        </div>
                    </div>
                    <div className="col-12 form-group mt-3">
                        <label className="field-required" htmlFor="value">Estimation</label>
                        <input type="number" id="value" name="value" className="form-control" placeholder="Enter Value"
                            value={groupFormData.estimation} onChange={event => updateGroupFormData({ ...groupFormData, estimation: event.target.value })} />
                    </div>
                    <div className="col-12 form-group mt-3">
                        <label className="field-required">Persons Name</label>
                        {
                            groupFormData.persons.map((person: any, person_ind: number,) => (
                                <div className="row align-items-center mb-3" key={person.id}>
                                    <div className="col-9">
                                        <input type="text" id={"persons-name" + person.id} name={"persons-name" + person.id} className="form-control" placeholder="Enter Name"
                                            value={groupFormData.remarks} onChange={event => {
                                                groupFormData.persons[person_ind].name = event.target.value
                                                updateGroupFormData({ ...groupFormData })
                                            }} />
                                    </div>
                                    <div className="col-3">
                                        {
                                            groupFormData.persons.length > 1 &&
                                            <button type="button" className="btn btn-outline-danger btn-sm me-2 ng-star-inserted" onClick={() => {
                                                groupFormData.persons.splice(person_ind, 1)
                                                updateGroupFormData({ ...groupFormData })
                                            }}>
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        }
                                        {
                                            person_ind === groupFormData.persons.length - 1 &&
                                            <button type="button" className="btn btn-outline-secondary btn-sm ng-star-inserted" onClick={() => {
                                                groupFormData.persons.push({ id: uuidv4() });
                                                updateGroupFormData({ ...groupFormData })
                                            }}>
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        }
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
                        <button className="btn btn-success" onClick={createNewGroup}><i className="fa-regular fa-circle-check"></i> Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
