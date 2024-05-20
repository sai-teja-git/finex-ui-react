import axios from "axios";

const signUp = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, body)
}

const verifyUser = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user/verify`, body)
}

const login = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user/login`, body)
}

const resetPassword = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user/reset-password`, body)
}

const overridePassword = (body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/user/override-password`, body)
}

const updateUserDetails = (body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/user`, body)
}

const updateUserPassword = (body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/user/password`, body)
}

const userApiService = {
    signUp,
    verifyUser,
    login,
    resetPassword,
    overridePassword,
    updateUserDetails,
    updateUserPassword
}

export default userApiService