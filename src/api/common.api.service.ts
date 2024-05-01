import axios from "axios";
import { environment } from "../environments/environment.dev";

const getAllTimeZones = () => {
    return axios.get(`${environment.API_URL}/time-zones`)
}

const getAllCurrency = () => {
    return axios.get(`${environment.API_URL}/currency`)
}

const getAllIcons = () => {
    return axios.get(`${environment.API_URL}/icons/all`)
}

const commonApiService = {
    getAllTimeZones,
    getAllCurrency,
    getAllIcons,
}

export default commonApiService