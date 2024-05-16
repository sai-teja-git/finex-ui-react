import { useEffect, useState } from "react";
import Currency from "../../../components/Currency";
import helperService from "../../../services/helper-functions.service";
import NoData from "../../../components/NoData";
import toast from "react-hot-toast";
import splitBillApiService from "../../../api/split-bill.api.service";
import timeConversionsService from "../../../services/time-conversions.service";
import transformationService from "../../../services/transformations.service";

interface ISingleBillGroup {
    overallDataLoad: boolean;
    singleGroupData: any;
    refreshOverallData: Function
}

export default function SingleBillGroup({ overallDataLoad, singleGroupData = {}, refreshOverallData }: ISingleBillGroup) {

    const [billLogData, updateBillLogData] = useState<any>(createBillLogObj());
    const [billLogAction, updateBillLogAction] = useState("add");
    const [selectedPersons, updateSelectedPersons] = useState<any>({});
    const [selectedPersonsValue, updateSelectedPersonsValue] = useState<any>({});
    const [filteredPersons, updateFilteredPersons] = useState<any[]>([]);
    const [personSearch, updatePersonSearch] = useState("");
    const [splitBillWarning, updateSplitBillWarning] = useState(0);
    const [loadBillSubmit, updateBillSubmitLoad] = useState(false);
    const [loadGroupBills, updateGroupBillsLoad] = useState(true);
    const [groupBills, updateGroupBills] = useState<any[]>([]);
    const [selectedBillToDelete, updateDeletingBill] = useState<any>({});
    const [loadBillDelete, updateBillDeleteLoad] = useState(false);
    const [loadPersonData, updatePersonDataLoad] = useState(true);
    const [personBillData, updatePersonBillData] = useState<any>({});


    useEffect(() => {
        getPageData()
    }, [])

    function getPageData() {
        getGroupBills()
        getPersonWiseBill()
    }

    function getGroupBills() {
        updateGroupBillsLoad(true)
        splitBillApiService.getGroupBillList(singleGroupData._id).then(res => {
            updateGroupBills(res.data?.bills ?? [])
            updateGroupBillsLoad(false);
        }).catch(() => {
            updateGroupBills([])
            updateGroupBillsLoad(false);
        })
    }

    function getPersonWiseBill() {
        updatePersonDataLoad(true);
        splitBillApiService.getPersonBillData(singleGroupData._id).then(res => {
            updatePersonBillData(res.data?.data ?? {})
            updatePersonDataLoad(false);
        }).catch(() => {
            updatePersonBillData({})
            updatePersonDataLoad(false);
        })
    }

    function createBillLogObj() {
        return {
            value: "",
            name: "",
            selectAll: false,
            disableSpitEven: true
        }
    }

    function returnPersonBillObject(person: any) {
        return {
            edited: false,
            id: person._id
        }
    }

    function openAddBill() {
        updateBillLogData(createBillLogObj());
        updateSelectedPersons({});
        updateBillLogAction("add")
        updateSelectedPersonsValue({});
        updateSplitBillWarning(0)
        updatePersonSearch("")
        $("#billLog").offcanvas("show")
        updateBillLogPersons();
    }

    function openUpdateBill(selected: any) {
        let editedPerson = false
        let personData: any = {};
        let personValue: any = {};
        for (let item of selected.persons) {
            if (item.edited) {
                editedPerson = true
            }
            personData[item.person_id] = {
                edited: item.edited,
                id: item.person_id
            }
            personValue[item.person_id] = item.value
        }
        updateSelectedPersons(personData);
        updateSelectedPersonsValue(personValue);
        updateBillLogData({
            value: selected.value,
            name: selected.name,
            selectAll: selected.persons.length === singleGroupData.persons.length,
            disableSpitEven: !editedPerson,
            oldData: selected
        });
        updateBillLogAction("update")
        updateSplitBillWarning(0)
        updatePersonSearch("")
        $("#billLog").offcanvas("show")
        updateBillLogPersons();
    }

    useEffect(() => {
        updateBillLogPersons()
    }, [personSearch])

    function updateBillLogPersons() {
        const persons = helperService.filterArrayOnSearch(singleGroupData.persons, ["name"], personSearch)
        updateFilteredPersons(persons)
    }

    function updateUserSelection(selected: any) {
        let personsData = { ...selectedPersons };
        let personsValue = { ...selectedPersonsValue };
        if (selected._id in personsData) {
            delete personsData[selected._id]
            delete personsValue[selected._id]
        } else {
            personsData[selected._id] = returnPersonBillObject(selected)
            personsValue[selected._id] = ""
        }
        updateSelectedPersonsValue(personsValue)
        updateSelectedPersons(personsData)
    }

    function clickOnSelectAll() {
        let personsData = { ...selectedPersons };
        let personsValue = { ...selectedPersonsValue };
        if (billLogData.selectAll) {
            personsData = {};
            personsValue = {}
        } else {
            for (let person of singleGroupData.persons) {
                personsData[person._id] = returnPersonBillObject(person)
                personsValue[person._id] = ""
            }
        }
        updateSelectedPersonsValue(personsValue)
        updateSelectedPersons(personsData)
    }

    function resetEditedPersonBills() {
        let personsData = { ...selectedPersons }
        for (let key in personsData) {
            personsData[key].edited = false;
        }
        updateSelectedPersons(personsData)
    }

    function editingPersonBillValue(person: any, event: any) {
        updateSelectedPersons({
            ...selectedPersons,
            [person._id]: {
                ...selectedPersons[person._id],
                edited: true
            }
        })
        updateSelectedPersonsValue({
            ...selectedPersonsValue,
            [person._id]: event.target.value
        })
        updateBillLogData({
            ...billLogData,
            disableSpitEven: false
        })

    }

    useEffect(() => {
        checkUserSelectAllStatus()
        calculateSplitBill()
    }, [selectedPersons])

    function checkUserSelectAllStatus() {
        try {
            const selectAll = Object.keys(selectedPersons).length === singleGroupData.persons.length
            updateBillLogData({
                ...billLogData,
                selectAll
            })
        } catch { }
    }

    function calculateSplitBill() {
        const billValue = billLogData.value
        if (!billValue) {
            return;
        }
        let personsValue = { ...selectedPersonsValue }
        let persons_to_update = [];
        let nonUpdatable = 0;
        let personAvailable = false;
        for (let key in selectedPersons) {
            if (selectedPersons[key].edited) {
                if (personsValue[key]) {
                    nonUpdatable += Number(personsValue[key])
                }
            } else {
                persons_to_update.push(selectedPersons[key])
                if (!personAvailable) {
                    personAvailable = true
                }
            }
        }
        let totalBill = Number(billValue) - nonUpdatable;
        const persons_length = persons_to_update.length;
        for (let i = 0; i < persons_length; i++) {
            const person = persons_to_update[i]
            if (totalBill >= 0) {
                const one_person_bill = (totalBill / (persons_length - i)).toFixed(0);
                personsValue[person.id] = Number(one_person_bill) > 0 ? one_person_bill : String(0);
                totalBill -= Number(one_person_bill)
            } else {
                personsValue[person.id] = String(0);
            }
        }
        updateSelectedPersonsValue(personsValue)
        if (Object.keys(selectedPersons).length) {
            updateSplitBillWarning(totalBill);
        }
    }

    function submitGroupBill() {
        if (!Object.keys(selectedPersons).length) {
            toast.error("Assign bill to at least one person", {
                id: "no-bill-assign"
            });
            return;
        }
        if (splitBillWarning) {
            toast.error("Bill amount has not been evenly distributed", {
                id: "invalid-distribution"
            });
            return;
        }
        if (billLogAction === "update") {
            updateGroupBill();
            return;
        }
        updateBillSubmitLoad(true)
        let personsData: any[] = [];
        for (let key in selectedPersons) {
            if (selectedPersonsValue[key]) {
                personsData.push({
                    person_id: key,
                    value: Number(selectedPersonsValue[key]),
                    edited: selectedPersons[key].edited
                })
            }
        }
        const body = {
            group_id: singleGroupData["_id"],
            name: billLogData.name,
            value: Number(billLogData.value),
            persons: personsData
        }
        splitBillApiService.createNewBill(body).then(() => {
            toast.success("Bill Created", { duration: 1500 })
            getPageData();
            $("#billLog").offcanvas("hide")
            updateBillSubmitLoad(false)
            try {
                refreshOverallData()
            } catch { }
        }).catch(e => {
            updateBillSubmitLoad(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })

    }

    function updateGroupBill() {
        let change = false;
        if (
            (billLogData["name"] !== billLogData.oldData.name) ||
            (Number(billLogData["value"])) !== Number(billLogData.oldData.value)
        ) {
            change = true;
        }
        if (!change) {
            let diff_users: any = {}
            for (let key in selectedPersons) {
                if (selectedPersonsValue[key]) {
                    diff_users[key] = Number(selectedPersonsValue[key])
                }
            }
            for (let person of billLogData.oldData.persons) {
                if (person.person_id in diff_users && person.value === diff_users[person.person_id]) {
                    delete diff_users[person.person_id]
                }
            }
            if (Object.keys(diff_users).length) {
                change = true;
            }
        }
        if (!change) {
            toast.error("No Change", { id: "no-change-in-update", duration: 1500 });
            return
        }
        updateBillSubmitLoad(true)
        let personsData: any[] = [];
        for (let key in selectedPersons) {
            if (selectedPersonsValue[key]) {
                personsData.push({
                    person_id: key,
                    value: Number(selectedPersonsValue[key]),
                    edited: selectedPersons[key].edited
                })
            }
        }
        const body = {
            group_id: singleGroupData["_id"],
            name: billLogData.name,
            value: Number(billLogData.value),
            persons: personsData
        }
        splitBillApiService.updateGroupBill(billLogData.oldData._id, body).then(() => {
            toast.success("Bill Updated", { duration: 1500 })
            getPageData();
            $("#billLog").offcanvas("hide")
            updateBillSubmitLoad(false)
            try {
                refreshOverallData()
            } catch { }
        }).catch(e => {
            updateBillSubmitLoad(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })
    }

    function deleteGroupBill() {
        updateBillDeleteLoad(true)
        splitBillApiService.deleteBill(selectedBillToDelete._id).then(() => {
            toast.success("Record Deleted", { duration: 1500 })
            updateBillDeleteLoad(false)
            getPageData();
            try {
                refreshOverallData()
            } catch { }
            $("#groupBillDeleteConfirm").modal("hide")
        }).catch(e => {
            updateBillDeleteLoad(false)
            toast.error(e?.response?.data?.message ?? `Deletion Failed`, { duration: 1500 })
        })
    }

    function openSinglePersonBill() {
        $("#viewPersonBill").offcanvas("show")
    }

    function singleGroupOverallTemplate() {
        return <>
            <div className={`overview ${overallDataLoad && "placeholder-glow"}`} >
                <div className="overview-block estimation">
                    <div className="block-left">
                        <div className="amount">
                            {
                                overallDataLoad ? <span className="placeholder col-10"></span> :
                                    <Currency value={singleGroupData.estimation ?? 0} />
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
                                overallDataLoad ? <span className="placeholder col-10"></span> :
                                    <Currency value={singleGroupData.actual ?? 0} />
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
                                overallDataLoad ? <span className="placeholder col-10"></span> :
                                    <Currency value={singleGroupData.paid ?? 0} />
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
                                overallDataLoad ? <span className="placeholder col-10"></span> : singleGroupData.persons?.length ?? 0
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

    function groupBillLoadingTemplate() {
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

    function personDataLoadTemplate() {
        return <>
            {
                Array(10).fill(0).map((_e, i) => (
                    <div className="person-data-item placeholder-glow" key={i}>
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
            }
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
                            <button className="btn btn-outline-secondary btn-sm" onClick={openAddBill} disabled={loadGroupBills}><i className="fa-solid fa-plus"></i> Add Bill</button>
                        </div>
                    </div>
                    <div className="card-body">
                        {
                            loadGroupBills ? groupBillLoadingTemplate()
                                :
                                <>
                                    {
                                        groupBills.length ?
                                            <>
                                                {
                                                    groupBills.map(bill => (
                                                        <div className={`transactions-block`} key={bill._id}>
                                                            <div className="transaction-data">
                                                                <div className="details">
                                                                    <div className={`icon`}>
                                                                        <i className="fa-regular fa-money-bill-1"></i>
                                                                    </div>
                                                                    <div className="names">
                                                                        <div className="remarks">
                                                                            {bill.name}
                                                                        </div>
                                                                        <div className="category">
                                                                            Shared By : {bill.persons.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="value">
                                                                    <div className="amount">
                                                                        <Currency value={bill.value} />
                                                                    </div>
                                                                    <div className="created-at">
                                                                        <i className="fa-regular fa-clock"></i> {timeConversionsService.convertUtcDateTimeToLocal(bill.created_at, "DD-MM-YYYY HH:mm:ss") as string}
                                                                    </div>
                                                                    <div className="transaction-options">
                                                                        <div className="option delete" onClick={() => {
                                                                            updateDeletingBill(bill)
                                                                            $("#groupBillDeleteConfirm").modal("show")
                                                                        }}>
                                                                            <i className="fa-regular fa-trash-can "></i><span className="name">Delete</span>
                                                                        </div>
                                                                        <div className="option edit" onClick={() => openUpdateBill(bill)}>
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
                                                <NoData title="No Data" text="No bills in this group" />
                                            </div>
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
                            <button className="btn btn-outline-secondary btn-sm" disabled={loadPersonData}><i className="fa-solid fa-plus"></i> Add Persons</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="person-data-block">
                            {
                                loadPersonData ? personDataLoadTemplate()
                                    :
                                    <>
                                        {
                                            singleGroupData.persons.map((person: any) => (
                                                <div className="person-data-item" key={person._id}>
                                                    <div className="user-block">
                                                        <div className="icon" style={{ "--fill-percentage": `${personBillData[person._id]?.paid_percentage ?? 0}%` } as React.CSSProperties}>
                                                            <i className="fa-solid fa-user"></i>
                                                        </div>
                                                        <div className="person-name">
                                                            {person.name}
                                                        </div>
                                                    </div>
                                                    <div className="value-block">
                                                        <div className="value-item actual">
                                                            <div className="name">
                                                                Total
                                                            </div>
                                                            <div className="currency-value">
                                                                <Currency value={personBillData[person._id]?.total ?? 0} />
                                                            </div>
                                                        </div>
                                                        <div className="value-item paid">
                                                            <div className="name">
                                                                Paid
                                                            </div>
                                                            <div className="currency-value">
                                                                <Currency value={personBillData[person._id]?.paid ?? 0} />
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
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="offcanvas offcanvas-end" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} id="billLog" aria-labelledby="staticBackdropLabel">
            <div className="offcanvas-header border-bottom">
                <div className="title">
                    {transformationService.titleCase(billLogAction)} New Bill
                </div>
                <div className="options">
                    <div className={`option-item close ${loadBillSubmit ? "disabled-block" : ""}`}>
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
                                    <input type="number" id="bill-value" name="bill-value" className="form-control" placeholder="Enter Value"
                                        value={billLogData.value} disabled={loadBillSubmit} onChange={event => {
                                            updateBillLogData({ ...billLogData, value: event.target.value, disableSpitEven: true });
                                            if (event.target.value) {
                                                resetEditedPersonBills()
                                            } else {
                                                updateSelectedPersonsValue({})
                                                updateSelectedPersons({})
                                            }
                                        }} />
                                </div>
                                <div className="value-split">
                                    <button className="btn btn-outline-secondary" disabled={billLogData.disableSpitEven || loadBillSubmit} onClick={() => {
                                        resetEditedPersonBills()
                                        updateBillLogData({ ...billLogData, disableSpitEven: true });
                                    }}>Split Evenly</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 form-group mt-3">
                            <label className="field-required" htmlFor="bill-name">Name</label>
                            <input type="text" id="bill-name" name="bill-name" className="form-control" placeholder="Enter Bill Name"
                                value={billLogData.name} disabled={loadBillSubmit} onChange={event => updateBillLogData({ ...billLogData, name: event.target.value })} />
                        </div>
                    </div>

                    {
                        splitBillWarning !== 0 &&
                        <div className="warning-box mt-3">
                            <i className="fa-solid fa-triangle-exclamation"></i>{splitBillWarning < 0 ? "Split amount exceeds expense amount by" : "Remaining amount by"}
                            <div className="d-flex justify-content-center">
                                <Currency value={splitBillWarning * (splitBillWarning < 0 ? -1 : 1)} />
                            </div>
                        </div>
                    }

                    <div className={`person-selection-block mt-4 ${(!billLogData.value || !billLogData.name) ? "disabled-block" : ""}`}>
                        <div className="header">
                            <div className={`select-all ${loadBillSubmit ? "disabled-block" : ""}`} onClick={clickOnSelectAll}>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="all" checked={billLogData.selectAll ?? false} readOnly />
                                </div>
                                <div className="name">
                                    All
                                </div>
                            </div>
                            <div className="search-bar">
                                <input type="text" name="search-persons" id="search-persons" className="form-control" placeholder="Search Persons" value={personSearch} onChange={(e) => {
                                    updatePersonSearch(e.target.value)
                                }} />
                            </div>
                        </div>
                        <div className="body">
                            {
                                filteredPersons.map(person => (
                                    <div className="user-block" key={person._id}>
                                        <div className={`user-details ${loadBillSubmit ? "disabled-block" : ""}`} onClick={() => updateUserSelection(person)}>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id={"check" + person._id} checked={selectedPersons[person._id] ?? false} readOnly />
                                            </div>
                                            <div className="name">
                                                {person.name}
                                            </div>
                                        </div>
                                        <div className="options">
                                            <div className="value">
                                                <input type="number" id={"person-value" + person._id} name={"person-value" + person._id} className="form-control" placeholder="value" disabled={!selectedPersons[person._id] || loadBillSubmit}
                                                    value={selectedPersonsValue[person._id] ?? ""} onChange={(e) => editingPersonBillValue(person, e)} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                !filteredPersons.length &&
                                <NoData text="No Data" />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas-footer end">
                <div className="option">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas" disabled={loadBillSubmit}><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                </div>
                <div className="option">
                    {
                        loadBillSubmit ?
                            <button className="btn btn-success" disabled><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Loading...</button>
                            :
                            <button className="btn btn-success" onClick={submitGroupBill}><i className="fa-regular fa-circle-check"></i> Submit</button>
                    }
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

        <div className="modal fade" id="groupBillDeleteConfirm" data-bs-backdrop="static" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                <button className="btn btn-secondary" data-bs-dismiss="modal" disabled={loadBillDelete}>Cancel</button>
                            </div>
                            <div className="option">
                                {
                                    loadBillDelete ?
                                        <button className="btn btn-ft-outline-primary" disabled><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Deleting...</button>
                                        :
                                        <button className="btn btn-ft-outline-primary" onClick={deleteGroupBill}>Delete</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
