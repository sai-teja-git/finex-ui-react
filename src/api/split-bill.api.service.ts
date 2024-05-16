import axios from "axios";
import { environment } from "../environments/environment.dev";

const createNewGroup = (body: any) => {
    return axios.post(`${environment.API_URL}/split-bill`, body)
}

const getMonthGroups = (params: any) => {
    return axios.get(`${environment.API_URL}/split-bill`, {
        params
    })
}

const updateBillGroup = (id: string, body: any) => {
    return axios.patch(`${environment.API_URL}/split-bill/${id}`, body)
}

const deleteBillGroup = (id: string) => {
    return axios.delete(`${environment.API_URL}/split-bill/${id}`)
}

const createNewBill = (body: any) => {
    return axios.post(`${environment.API_URL}/split-bill/bill`, body)
}

const getGroupBillList = (group: string) => {
    return axios.get(`${environment.API_URL}/split-bill/group/${group}`)
}


const updateGroupBill = (id: string, body: any) => {
    return axios.patch(`${environment.API_URL}/split-bill/bill/${id}`, body)
}

const deleteBill = (id: string) => {
    return axios.delete(`${environment.API_URL}/split-bill/bill/${id}`)
}

const getPersonBillData = (group: string) => {
    return axios.get(`${environment.API_URL}/split-bill/person-wise/${group}`)
}

const splitBillApiService = {
    createNewGroup,
    getMonthGroups,
    deleteBillGroup,
    updateBillGroup,
    createNewBill,
    getGroupBillList,
    deleteBill,
    updateGroupBill,
    getPersonBillData
}

export default splitBillApiService