import axios from "axios";

const env = import.meta.env

const signUp = (body: any) => {
    return axios.post(`${env.VITE_API_URL}/user/signup`, body)
}

const verifyUser = (body: any) => {
    return axios.post(`${env.VITE_API_URL}/user/verify`, body)
}

const login = (body: any) => {
    return axios.post(`${env.VITE_API_URL}/user/login`, body)
}

const resetPassword = (body: any) => {
    return axios.post(`${env.VITE_API_URL}/user/reset-password`, body)
}

const overridePassword = (body: any) => {
    return axios.patch(`${env.VITE_API_URL}/user/override-password`, body)
}

const updateUserDetails = (body: any) => {
    return axios.patch(`${env.VITE_API_URL}/user`, body)
}

const updateUserPassword = (body: any) => {
    return axios.patch(`${env.VITE_API_URL}/user/password`, body)
}

const getDeletingUserName = (code: string) => {
    return axios.get(`${env.VITE_API_URL}/user/deleting/${code}`)
}

const userDeleteConfirmed = (code: string) => {
    return axios.delete(`${env.VITE_API_URL}/user/${code}`)
}

const deleteRequest = () => {
    return axios.delete(`${env.VITE_API_URL}/user/delete-request`)
}

const userApiService = {
    signUp,
    verifyUser,
    login,
    resetPassword,
    overridePassword,
    updateUserDetails,
    updateUserPassword,
    getDeletingUserName,
    userDeleteConfirmed,
    deleteRequest
}

export default userApiService