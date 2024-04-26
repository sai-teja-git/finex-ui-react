import axios from "axios";
import { environment } from "../environments/environment.dev";

const signUp = (body: any) => {
    return axios.post(`${environment.API_URL}/user/signup`, body)
}

const UserApiService = {
    signUp
}

export default UserApiService