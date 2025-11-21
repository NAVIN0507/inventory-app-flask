"use server"
import { axiosInstance } from "../axios"

type Response = {
    success: boolean;
    data:any;
    message: string;
} 
export const loginUser = async (email: string, password: string):Promise<Response> => {
    try {
        const response = await axiosInstance.post("/auth/login" , {
            email:email,
            password:password
        })
        if(response.status === 200){
            return {
                success:true,
                data:response.data,
                message:"Login Successful"
            }
        }
        return {
            success:false,
            data:null,
            message:"Login Failed"
        }
    } catch (error) {
     return {
        success:false,
        data:null,
        message:"Something went wrong "
     }   
    }
}

export const registerUser = async (name:string , email: string, password: string):Promise<Response> => {
    try {
        const response = await axiosInstance.post("/auth/register" , {
            name:name,
            email:email,
            password:password
        })
        if(response.status === 200){
            return {
                success:true,
                data:response.data,
                message:"Registration Successful"
            }
        }
        return {
            success:false,
            data:null,
            message:"Registration Failed"
        }
    } catch (error) {
     return {
        success:false,
        data:null,
        message:"Something went wrong "
     }   
    } 
}

export const getCurrentUser = async (token:string):Promise<Response> => {
    try {
        const response = await axiosInstance.get("/auth/me" , {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(response.status === 200){
            return {
                success:true,
                data:response.data,
                message:"User fetched successfully"
            }
        }
        return {
            success:false,
            data:null,
            message:"Failed to fetch user"
        }
    } catch (error) {
     return {
        success:false,
        data:null,
        message:"Something went wrong "
     }   
    }
}