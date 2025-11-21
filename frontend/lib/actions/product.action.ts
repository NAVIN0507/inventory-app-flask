import { axiosInstance } from "../axios";

type Response = {
    success: boolean;
    data:any;
    message: string;
}

export const fetchProductsByUser = async (userId: number):Promise<Response> => {
    try {
        const response = await axiosInstance.get(`/product/getproductsbyuser/${userId}`);
        if(response.status === 200){
            return {
                success:true,
                data:response.data,
                message:"Products fetched successfully"
            }
        }
        return {
            success:false,
            data:null,
            message:"Failed to fetch products"
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
