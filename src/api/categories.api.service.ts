import axios from "axios";

const getUserCategories = () => {
    return axios.get(`${import.meta.env.VITE_API_URL}/user-category`)
}

const createUserCategories = (body: any) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user-category`, body)
}

const updateUserCategories = (id: string, body: any) => {
    return axios.patch(`${import.meta.env.VITE_API_URL}/user-category/${id}`, body)
}

const catagoriesApiService = {
    getUserCategories,
    createUserCategories,
    updateUserCategories
}

export default catagoriesApiService