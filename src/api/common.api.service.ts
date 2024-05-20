import axios from "axios";

const getAllTimeZones = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/time-zones`)
}

const getAllCurrency = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/currency`)
}

const getAllIcons = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/icons/all`)
}

const commonApiService = {
    getAllTimeZones,
    getAllCurrency,
    getAllIcons,
}

export default commonApiService