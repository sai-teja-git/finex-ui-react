import axios from "axios";
import { environment } from "../environments/environment.dev";

const signUp = (body: any) => {
    return axios.post(`${environment.API_URL}/user/signup`, body)
}

const verifyUser = (body: any) => {
    return axios.post(`${environment.API_URL}/user/verify`, body)
}

const login = (body: any) => {
    return axios.post(`${environment.API_URL}/user/login`, body)
}

const resetPassword = (body: any) => {
    return axios.post(`${environment.API_URL}/user/reset-password`, body)
}

const overridePassword = (body: any) => {
    return axios.patch(`${environment.API_URL}/user/override-password`, body)
}

const updateUserDetails = (body: any) => {
    return axios.patch(`${environment.API_URL}/user`, body)
}

const userApiService = {
    signUp,
    verifyUser,
    login,
    resetPassword,
    overridePassword,
    updateUserDetails
}

export default userApiService