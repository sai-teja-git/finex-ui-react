import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { ROUTER_KEYS } from "../router/router-keys";
import globalRouter from "../services/globalRouter";

const onRequest = (config: InternalAxiosRequestConfig) => {
    const excludeEndPoints: boolean[] = [
        config.url?.endsWith("/login") == true,
        config.url?.endsWith("/signup") == true,
        config.url?.endsWith("/verify") == true,
        config.url?.endsWith("/override-password") == true,
    ]
    if (!excludeEndPoints.includes(true)) {
        config.headers.Authorization = `Bearer ${sessionStorage.getItem("access_token")}`
    }
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
        toast.error("Session Expired", { duration: 2000, id: "session-expired" });
        if (globalRouter.navigate) {
            globalRouter.navigate(ROUTER_KEYS.login.url)
        }
    }
    return Promise.reject(error);
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}