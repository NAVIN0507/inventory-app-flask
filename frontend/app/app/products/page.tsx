"use client"
import LocationCard from '@/components/location-card';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useProductsWithLocations } from '@/hooks/use-product';
import { useUser } from '@/hooks/use-user';
import { LoaderPinwheelIcon, Plus } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddProductForm from '@/components/add-product-form';
const page = () => {
      const {user , loading} = useUser();
  const {product_count , products} =  useProductsWithLocations(user?.user_id)
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
    <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
        <h1 className='text-xl'>My Products ({product_count})</h1>
        <Dialog>
  <DialogTrigger asChild>
      <Button className='border rounded-lg' variant={"secondary"}>
            <Plus/> Add Product
        </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle></DialogTitle>
   <AddProductForm/>
  </DialogContent>
</Dialog>
        
      
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5 gap-4'>
            {products.map((product => <ProductCard  productswithlocation={product} key={product.product_id}/>))}
        </div>
    </div>
  )
}

export default page