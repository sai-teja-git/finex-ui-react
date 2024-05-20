import axios from "axios";

const createNewGroup = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/split-bill`, body)
}

const getMonthGroups = (params: any) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/split-bill`, {
        params
    })
}

const updateBillGroup = (id: string, body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/split-bill/${id}`, body)
}

const deleteBillGroup = (id: string) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/split-bill/${id}`)
}

const createNewBill = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/split-bill/bill`, body)
}

const getGroupBillList = (group: string) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/split-bill/group/${group}`)
}


const updateGroupBill = (id: string, body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/split-bill/bill/${id}`, body)
}

const deleteBill = (id: string) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/split-bill/bill/${id}`)
}

const getPersonBillData = (group: string) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/split-bill/person-wise/${group}`)
}

const addNewPersons = (group: string, body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/split-bill/group/person/${group}`, body)
}

const deletePerson = (params: any) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/split-bill/person`, {
        params
    })
}

const updatePersonData = (body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/split-bill/person-details`, body)
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
    getPersonBillData,
    addNewPersons,
    deletePerson,
    updatePersonData
}

export default splitBillApiService