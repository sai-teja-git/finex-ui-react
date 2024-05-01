import axios from "axios";
import { environment } from "../environments/environment.dev";

const getUserCategories = () => {
    return axios.get(`${environment.API_URL}/user-category`)
}

const catagoriesApiService = {
    getUserCategories
}

export default catagoriesApiService