import axios from "axios";
import { environment } from "../environments/environment.dev";

const getAllTimeZones = () => {
    return axios.get(`${environment.API_URL}/time-zones`)
}

const getAllCurrency = () => {
    return axios.get(`${environment.API_URL}/currency`)
}

const commonApiService = {
    getAllTimeZones,
    getAllCurrency,
}

export default commonApiService