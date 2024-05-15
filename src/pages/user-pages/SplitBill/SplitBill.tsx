import { useEffect, useState } from "react";
import "./SplitBill.scss";
import MonthPicker from "../../../components/MonthPicker/MonthPicker";
import moment from "moment-timezone";
import Currency from "../../../components/Currency";
import { v4 as uuidv4 } from 'uuid';
import SingleBillGroup from "./SingleBillGroup";
import transformationService from "../../../services/transformations.service";
import helperService from "../../../services/helper-functions.service";
import toast from "react-hot-toast";
import splitBillApiService from "../../../api/split-bill.api.service";
import timeConversionsService from "../../../services/time-conversions.service";
import NoData from "../../../components/NoData";

export default function SplitBill() {
    const [selectedMonth, updateAnalysisMonth] = useState(moment());
    const [groupFormAction, updateFormAction] = useState("add");
    const [loadGroupSubmit, updateGroupSubmitFlag] = useState(false)
    const [groupFormData, updateGroupFormData] = useState<any>(createNewPersonObj());
    const [pageViewType, updatePageView] = useState("overallData");
    const [loadGroupData, updateGroupDataLoadFlag] = useState(true);
    const [groupData, updateGroupData] = useState<any[]>([]);
    const [selectedDataToDelete, updateDeleteSelect] = useState<any>({});
    const [loadDeleteRecord, updateDeleteLoadFlag] = useState(false);
    const [selectedGroupToView, updateSelectedViewGroup] = useState<any>({});


    useEffect(() => {
        getSelectedMonthData()
    }, [selectedMonth])

    function monthUpdated(event: any): any {
        updateAnalysisMonth(event.value)
    }

    function getSelectedMonthData() {
        updateGroupDataLoadFlag(true)
        const monthStart = selectedMonth.startOf("month");
        const monthEnd = moment(monthStart).add(1, "month");
        const body = {
            start_time: timeConversionsService.convertLocalDateTimeToUtc(monthStart.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
            end_time: timeConversionsService.convertLocalDateTimeToUtc(monthEnd.format("yyyy-MM-DD HH:mm:ss"), "yyyy-MM-DD HH:mm:ss"),
        }
        splitBillApiService.getMonthGroups(body).then(res => {
            let groupData: any[] = []
            try {
                groupData = res.data.data.map((item: any) => {
                    const base = Math.max(item.actual, item.paid, item.estimation)
                    return {
                        ...item,
                        actual_percentage: helperService.calculatePercentage(item.actual, base),
                        paid_percentage: helperService.calculatePercentage(item.paid, base),
                        estimation_percentage: helperService.calculatePercentage(item.estimation, base),
                    }
                })
            } catch {
                groupData = []
            }
            if (pageViewType === "singleGroup") {
                const viewItem = groupData.find(e => e._id === selectedGroupToView._id)
                if (viewItem) {
                    updateSelectedViewGroup(viewItem)
                }
            }
            updateGroupData(groupData)
            updateGroupDataLoadFlag(false)
        }).catch(() => {
            updateGroupData([])
            updateGroupDataLoadFlag(false)
        })
    }

    function openGroupAddForm() {
        updateFormAction("add")
        updateGroupFormData(createNewPersonObj())
        $("#groupLog").offcanvas("show")
    }

    function openGroupEditForm(selected: any) {
        updateFormAction("update")
        updateGroupFormData({
            title: selected.title,
            estimation: selected.estimation,
            oldData: selected
        })
        $("#groupLog").offcanvas("show")
    }

    function createNewPersonObj() {
        return {
            title: "",
            estimation: "",
            persons: [{
                id: uuidv4(),
                name: ""
            }]
        }
    }

    function createNewGroup() {
        console.log('groupFormData', groupFormData)
        const required = [{ key: "title", name: "Title" }, { key: "estimation", name: "Estimation" }];
        let missing_fields = []
        for (let item of required) {
            if (!helperService.inputValid(groupFormData[item.key])) {
                missing_fields.push(item.name)
            }
        }
        if (missing_fields.length) {
            const msg = `Fill the ${missing_fields.join(", ")} Fields`;
            toast.error(msg, {
                duration: 2500,
                id: "missing-fields"
            })
            return;
        }
        if (groupFormAction === "add") {
            let personNames = groupFormData["persons"].filter((e: any) => e.name);
            if (personNames.length) {
                if (personNames.length !== groupFormData["persons"].length) {
                    toast.error("Remove/Enter empty persons name", {
                        id: "missing-fields"
                    })
                    return;
                }
            } else {
                toast.error("Add at least one person name", {
                    id: "missing-fields"
                })
                return;
            }
        } else {
            updateGroupForm();
            return;
        }
        const body = {
            title: groupFormData.title,
            estimation: Number(groupFormData.estimation),
            persons: groupFormData.persons.map((e: any) => ({
                name: e.name
            }))
        }
        updateGroupSubmitFlag(true)
        splitBillApiService.createNewGroup(body).then(() => {
            toast.success("Group Created", { duration: 1500 })
            getSelectedMonthData();
            $("#groupLog").offcanvas("hide")
            updateGroupSubmitFlag(false)
        }).catch(e => {
            updateGroupSubmitFlag(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })
    }

    function updateGroupForm() {
        let body: any = {};
        if (groupFormData.title !== groupFormData.oldData.title) {
            body.title = groupFormData.title
        }
        if (Number(groupFormData.estimation) !== groupFormData.oldData.estimation) {
            body.estimation = Number(groupFormData.estimation)
        }
        if (!Object.keys(body).length) {
            toast.error("No Change", {
                id: "no-change-in-fields"
            })
            return
        }
        updateGroupSubmitFlag(true)
        splitBillApiService.updateBillGroup(groupFormData.oldData._id, body).then(() => {
            toast.success("Group Updated", { duration: 1500 })
            getSelectedMonthData();
            $("#groupLog").offcanvas("hide")
            updateGroupSubmitFlag(false)
        }).catch(e => {
            updateGroupSubmitFlag(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })
    }

    function openDeleteConfirm(selected: any) {
        updateDeleteSelect(selected)
        $("#groupDeleteConfirm").modal("show")
    }

    function deleteGroup() {
        updateDeleteLoadFlag(true)
        splitBillApiService.deleteBillGroup(selectedDataToDelete._id).then(() => {
            toast.success("Record Deleted", { duration: 1500 })
            updateDeleteLoadFlag(false)
            getSelectedMonthData();
            $("#groupDeleteConfirm").modal("hide")
        }).catch(e => {
            updateDeleteLoadFlag(false)
            toast.error(e?.response?.data?.message ?? `Deletion Failed`, { duration: 1500 })
        })
    }

    function openSingleGroupData(selected: any) {
        updateSelectedViewGroup(selected)
        updatePageView("singleGroup")
    }

    function openOverallData() {
        updatePageView("overallData")
    }

    function overallDataLoadingTemplate() {
        return <>
            <div className="overall-bill-data placeholder-glow">
                {
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
                                                    <div className="placeholder col-8"></div>
                                                </div>
                                                <div className="name">
                                                    Estimation
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="placeholder col-12"></div>
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
                                                    <div className="placeholder col-8"></div>
                                                </div>
                                                <div className="name">
                                                    Actual
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="placeholder col-12"></div>
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
                                                    <div className="placeholder col-8"></div>
                                                </div>
                                                <div className="name">
                                                    Paid
                                                </div>
                                            </div>
                                            <div className="log-progress">
                                                <div className="progress">
                                                    <div className="placeholder col-12"></div>
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

    function overallDataTemplate() {
        return <>
            {
                loadGroupData ?
                    overallDataLoadingTemplate()
                    :
                    <>
                        {
                            groupData.length ?
                                <>
                                    <div className="overall-bill-data placeholder-glow">
                                        {
                                            groupData.map(element => (
                                                <div className="bill-block" key={element._id}>
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <div className="card-title">
                                                                {element.title}
                                                            </div>
                                                            <div className="card-options">
                                                                <div className="option">
                                                                    <div className="dropdown fnx-dropdown">
                                                                        <div className="more-option" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                                                            <ul className="dropdown-menu">
                                                                                <li><a className="dropdown-item" onClick={() => openSingleGroupData(element)}>View</a></li>
                                                                                <li><a className="dropdown-item" onClick={() => openGroupEditForm(element)}>Edit</a></li>
                                                                                <li><a className="dropdown-item" onClick={() => openDeleteConfirm(element)}>Delete</a></li>
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
                                                                            <Currency value={element.estimation} />
                                                                        </div>
                                                                        <div className="name">
                                                                            Estimation
                                                                        </div>
                                                                    </div>
                                                                    <div className="log-progress">
                                                                        <div className="progress">
                                                                            <div className="progress-bar" style={{ width: `${element.estimation_percentage}%` }}></div>
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
                                                                            <Currency value={element.actual} />
                                                                        </div>
                                                                        <div className="name">
                                                                            Actual
                                                                        </div>
                                                                    </div>
                                                                    <div className="log-progress">
                                                                        <div className="progress">
                                                                            <div className="progress-bar" style={{ width: `${element.actual_percentage}%` }}></div>
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
                                                                            <Currency value={element.paid} />
                                                                        </div>
                                                                        <div className="name">
                                                                            Paid
                                                                        </div>
                                                                    </div>
                                                                    <div className="log-progress">
                                                                        <div className="progress">
                                                                            <div className="progress-bar" style={{ width: `${element.paid_percentage}%` }}></div>
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

                                :
                                <div className="centred-block-full-height">
                                    <NoData title="No Data" text="It seems you have a boring month" />
                                </div>
                        }
                    </>

            }
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
                                <div className="option" hidden={moment().format("yyyy-MM") !== selectedMonth.format("yyyy-MM")}>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={openGroupAddForm}><i className="fa-solid fa-plus"></i> Create New</button>
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
                    pageViewType === "overallData" ? overallDataTemplate() : <SingleBillGroup overallDataLoad={loadGroupData} singleGroupData={selectedGroupToView} refreshOverallData={getSelectedMonthData} />
                }
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="groupLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        {transformationService.titleCase(groupFormAction)} New Group
                    </div>
                    <div className="options">
                        <div className={`option-item close ${loadGroupSubmit ? "disabled-block" : ""}`}>
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="field-required" htmlFor="title-enter">Title</label>
                            <input type="text" id="title-enter" name="title-enter" className="form-control" placeholder="Enter Title"
                                value={groupFormData.title} disabled={loadGroupSubmit} onChange={(e) => {
                                    updateGroupFormData({
                                        ...groupFormData,
                                        title: e.target.value
                                    })
                                }} />
                        </div>
                        <div className="col-12 form-group mt-3">
                            <label className="field-required" htmlFor="value">Estimation</label>
                            <input type="number" id="value" name="value" className="form-control" placeholder="Enter Value"
                                value={groupFormData.estimation} disabled={loadGroupSubmit} onChange={(e) => {
                                    updateGroupFormData({
                                        ...groupFormData,
                                        estimation: e.target.value
                                    })
                                }} />
                        </div>
                        {
                            groupFormAction === "add" &&
                            <div className="col-12 form-group mt-3">
                                <label className="field-required">Persons Name</label>
                                {
                                    groupFormData.persons.map((person: any, person_ind: number,) => (
                                        <div className="row align-items-center mb-3" key={person.id}>
                                            <div className="col-9">
                                                <input type="text" id={"persons-name" + person.id} name={"persons-name" + person.id} className="form-control" placeholder="Enter Name"
                                                    value={groupFormData.persons[person_ind].name} disabled={loadGroupSubmit} onChange={event => {
                                                        groupFormData.persons[person_ind].name = event.target.value
                                                        updateGroupFormData({ ...groupFormData })
                                                    }} />
                                            </div>
                                            <div className="col-3">
                                                {
                                                    groupFormData.persons.length > 1 &&
                                                    <button type="button" className="btn btn-outline-danger btn-sm me-2 ng-star-inserted" disabled={loadGroupSubmit} onClick={() => {
                                                        groupFormData.persons.splice(person_ind, 1)
                                                        updateGroupFormData({ ...groupFormData })
                                                    }}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                }
                                                {
                                                    person_ind === groupFormData.persons.length - 1 &&
                                                    <button type="button" className="btn btn-outline-secondary btn-sm ng-star-inserted" disabled={loadGroupSubmit} onClick={() => {
                                                        groupFormData.persons.push({ id: uuidv4(), name: "" });
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
                        }
                    </div>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas" disabled={loadGroupSubmit}><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                    </div>
                    <div className="option">
                        {
                            loadGroupSubmit ?
                                <button className="btn btn-success" disabled><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Loading...</button>
                                :
                                <button className="btn btn-success" onClick={createNewGroup} disabled={loadGroupSubmit}><i className="fa-regular fa-circle-check"></i> Submit</button>
                        }
                    </div>
                </div>
            </div>

            <div className="modal fade" id="groupDeleteConfirm" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                            <button className="btn btn-ft-outline-primary" onClick={deleteGroup}>Delete</button>
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
