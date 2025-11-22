import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://inventory-app-flask.onrender.com/api",
    withCredentials:true,
})