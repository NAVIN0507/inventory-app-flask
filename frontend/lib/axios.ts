import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL! || "http://127.0.0.1:5000/api",
    withCredentials:true,
})