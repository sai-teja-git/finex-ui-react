import axios from "axios";
import { environment } from "../environments/environment.dev";

const getOverallLogs = (params: any) => {
    return axios.get(`${environment.API_URL}/transactions/overall`, {
        params
    })
}

const logTransaction = (type: string, body: any) => {
    return axios.post(`${environment.API_URL}/transactions/${type}`, body)
}

const transactionLogApiService = {
    getOverallLogs,
    logTransaction
}

export default transactionLogApiService 