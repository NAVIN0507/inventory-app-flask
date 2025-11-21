"use client"
import { useEffect, useState } from "react";
import { fetchLocationsByUser } from "@/lib/actions/location.actions";
import { fetchProductsByUser } from "@/lib/actions/product.action";


type ProductWithLocation = {
  description: string;
  image_url: string;
  location_address: string;
  location_img_url: string;  
  location_name: string;
  name: string;
  product_id: number;
  qty: number | null;
};


export const useProductsWithLocations = (user_id?: number) => {
  const [products, setProducts] = useState<ProductWithLocation[]>([]);
  const [product_count, setProductCount] = useState<number>(0);

  useEffect(() => {
    if (!user_id) return; // prevents invalid fetch

    const loadLocations = async () => {
      const response = await fetchProductsByUser(user_id);
      setProducts(response.data?.products || []);
     setProductCount(response.data?.product_count || 0);
    };

    loadLocations();
  }, [user_id]);

  return { products, product_count };
};
