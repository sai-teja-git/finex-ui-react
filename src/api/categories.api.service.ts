import axios from "axios";
import { environment } from "../environments/environment.dev";

const getUserCategories = () => {
    return axios.get(`${environment.API_URL}/user-category`)
}

const createUserCategories = (body: any) => {
    return axios.post(`${environment.API_URL}/user-category`, body)
}

const updateUserCategories = (id: string, body: any) => {
    return axios.patch(`${environment.API_URL}/user-category/${id}`, body)
}

const catagoriesApiService = {
    getUserCategories,
    createUserCategories,
    updateUserCategories
}

export default catagoriesApiService