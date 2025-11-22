"use client"
import AreaChart from '@/components/area-chart';
import { Button } from '@/components/ui/button';
import {Warehouses , LocationAvatar} from '@/components/ware-houses';
import { useLocations } from '@/hooks/use-locations';
import { useProductsWithLocations } from '@/hooks/use-product';
import { useUser } from '@/hooks/use-user'
import { ArrowRightIcon, ChevronRightIcon, Clock, LoaderPinwheelIcon, PlusIcon } from 'lucide-react';
import React from 'react'
import Link from 'next/link';
import ProductMovementsTable from '@/components/product-movement';

const page = () => {
  const {user , loading} = useUser();
  const {product_count , products}  = useProductsWithLocations(user?.user_id);
  const {location_count , locations} =  useLocations(user?.user_id)
  if(loading) {
    return <div className='h-screen flex items-center justify-center'>
      <LoaderPinwheelIcon className='animate-spin'/>
    </div>
  }
  if(!user){
    return <div className='h-screen flex items-center justify-center'>
      <LoaderPinwheelIcon className='animate-spin'/>
    </div>
  }
  return (
    <div className='flex flex-col space-y-2'>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
       <AreaChart totalProducts={[0 , 0 , location_count]} title='Total Warehouses' description='Origanizes your warehouses' />
       <AreaChart totalProducts={[0 , 0 , product_count]}  title='Total Products' description='Total number of products from your warehouses'/>
      </div>

      <div className='space-y-1 sm:grid  sm:grid-cols-3 gap-2 mt-10'>
        <div className='sm:col-span-2'>
          <WareHouseList total={location_count} locations={locations}/>
        </div>
         <div className='sm:col-span-1 max-sm:mt-4'>
          <ProductsList total={product_count} products={products}/>
        </div>

        <div className='col-span-3'>
            <ProductMovementsTable/>
        </div>
      </div>
    </div>
  )
}

export default page


 type Location = {
  address: string;
  name: string;
  location_id: number;
  image_url?: string;
};

const WareHouseList = ({total , locations}:{total:number;locations:Location[]}) =>{
  return(
    <div>
     <div className='flex flex-col'>
            <div className=' rounded-2xl border  overflow-hidden shadow-sm'>
                <div className='flex items-center justify-between px-6 py-5 '>
                    <div>
                        <h2 className='text-base font-semibold '>Ware Houses</h2>
                        <p className='text-sm text-neutral-500 mt-0.5'>{total} active ware houses</p>
                    </div>
                   
                </div>
                  <div className='divide-y '>
                    {locations.map(location=>(
                        <Link 
                            key={location.location_id}
                            href={`/app/locations/${location.location_id}`}
                            className='flex items-center gap-4 px-6 py-4  transition-colors group'
                        >
                            <div className='flex-1 min-w-0 flex items-center gap-3'>
                              <LocationAvatar name={location?.name} image_url={location?.image_url || ""}/>
                              <div className='flex flex-col'>
                                <p className='text-sm font-medium '>
                                    {location?.name}
                                </p>
                                <div className='flex items-center gap-3 mt-1.5'>
                                    <span className='inline-flex items-center text-xs font-medium  rounded-md'>
                                        {location?.address}
                                    </span>
                                  
                                </div>
                                </div>
                            </div>
                            <ChevronRightIcon className='size-5 group-hover:translate-x-0.5 transition-all'/>
                        </Link>
                    ))}
                    {locations.length === 0 && (
                        <div className='px-6 py-16 text-center'>
                            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full  mb-3'>
                                <Clock className='w-5 h-5 text-neutral-400' />
                            </div>
                            <p className='text-sm font-medium text-neutral-900'>No Warehouses yet</p>
                            <p className='text-sm text-neutral-500 mt-1'>Create your first Warehouse to get started</p>
                        </div>
                    )}
                </div>
                {locations.length > 0 && (
                    <div className='px-6 py-4 bg-accent'>
                        <Link 
                            href={`/app/locations`}
                            className='flex items-center justify-center gap-2 text-sm font-medium text-white transition-colors'
                        >
                            View all warehouses
                            <ArrowRightIcon className='size-4'/>
                        </Link>
                    </div>
                )}
            </div>
    
    </div>
    
    </div>
    
  )
  }
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
const ProductsList = ({total , products }:{total:number;products:ProductWithLocation[]}) =>{
  return(
    <div>
     <div className='flex flex-col'>
            <div className=' rounded-2xl border  overflow-hidden shadow-sm'>
                <div className='flex items-center justify-between px-6 py-5 '>
                    <div>
                        <h2 className='text-base font-semibold '>Products</h2>
                        <p className='text-sm text-neutral-500 mt-0.5'>{total} Products</p>
                    </div>
                   
                </div>
                  <div className='divide-y '>
                    {products.slice(products.length-4).map(product=>(
                        <Link 
                            key={product?.product_id}
                            href={`/app/products/${product?.product_id}`}
                            className='flex items-center gap-4 px-6 py-4  transition-colors group'
                        >
                            <div className='flex-1 min-w-0 flex items-center gap-3'>
                              <LocationAvatar name={product?.name} image_url={product?.image_url || ""}/>
                              <div className='flex flex-col'>
                                <p className='text-sm font-medium '>
                                    {product.name}
                                </p>
                                <div className='flex items-center gap-3 mt-1.5'>
                                    <span className='inline-flex items-center text-xs font-medium  rounded-md'>
                                        {product.description}
                                    </span>
                                  
                                </div>
                                </div>
                            </div>
                            <ChevronRightIcon className='size-5 group-hover:translate-x-0.5 transition-all'/>
                        </Link>
                    ))}
                    {products.length === 0 && (
                        <div className='px-6 py-16 text-center'>
                            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full  mb-3'>
                                <Clock className='w-5 h-5 text-neutral-400' />
                            </div>
                            <p className='text-sm font-medium text-neutral-900'>No products yet</p>
                            <p className='text-sm text-neutral-500 mt-1'>Create your first product to get started</p>
                        </div>
                    )}
                </div>
                {products.length > 0 && (
                    <div className='px-6 py-4 bg-accent'>
                        <Link 
                            href={`/app/products`}
                            className='flex items-center justify-center gap-2 text-sm font-medium text-white transition-colors'
                        >
                            View all Products
                            <ArrowRightIcon className='size-4'/>
                        </Link>
                    </div>
                )}
            </div>
    
    </div>
    
    </div>
    
  )
  }


