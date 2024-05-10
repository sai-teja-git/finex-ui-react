import axios from "axios";
import { environment } from "../environments/environment.dev";

const getOverallLogs = (params: any) => {
    return axios.get(`${environment.API_URL}/transactions/overall`, {
        params
    })
}

const getMonthCategoryWise = (params: any) => {
    return axios.get(`${environment.API_URL}/transactions/overall-category-wise`, {
        params
    })
}

const logTransaction = (type: string, body: any) => {
    return axios.post(`${environment.API_URL}/transactions/${type}`, body)
}

const updateTransaction = (params: any, body: any) => {
    return axios.patch(`${environment.API_URL}/transactions`, body, { params })
}

const deleteTransaction = (body: any) => {
    return axios.delete(`${environment.API_URL}/transactions`, { params: body })
}

const transactionLogApiService = {
    getOverallLogs,
    logTransaction,
    deleteTransaction,
    updateTransaction,
    getMonthCategoryWise
}

export default transactionLogApiService 