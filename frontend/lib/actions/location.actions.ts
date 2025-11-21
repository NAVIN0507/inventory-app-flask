"use server"
import { axiosInstance } from "../axios"

type Response = {
    success: boolean;
    data:any;
    message: string;
} 
export const fetchLocationsByUser = async (userId: number):Promise<Response> => {
    try {
        const response = await axiosInstance.get(`/location/${userId}`)
        if(response.status === 200){
            return {
                success:true,
                data:response.data,
                message:"Locations fetched successfully"
            }
        }   
        return {
            success:false,
            data:null,
            message:"Failed to fetch locations"
        }
    }
    catch (error) {
     return {
        success:false,
        data:null,
        message:"Something went wrong "
     }   
    }
}