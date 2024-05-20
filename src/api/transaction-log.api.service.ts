import axios from "axios";

const getOverallLogs = (params: any) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/transactions/overall`, {
        params
    })
}

const getMonthCategoryWise = (params: any) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/transactions/overall-category-wise`, {
        params
    })
}

const getMonthSingleCategoryWise = (params: any) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/transactions/category-month`, {
        params
    })
}

const logTransaction = (type: string, body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/transactions/${type}`, body)
}

const updateTransaction = (params: any, body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/transactions`, body, { params })
}

const deleteTransaction = (body: any) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/transactions`, { params: body })
}

const transactionLogApiService = {
    getOverallLogs,
    logTransaction,
    deleteTransaction,
    updateTransaction,
    getMonthCategoryWise,
    getMonthSingleCategoryWise
}

export default transactionLogApiService 