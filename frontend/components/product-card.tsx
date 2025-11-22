import React from 'react'
import { Package, MapPin, Box } from 'lucide-react'
import Link from 'next/link';

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

interface Props{
    productswithlocation:ProductWithLocation
}

const ProductCard = ({productswithlocation}:Props) => {
  const product = productswithlocation;
  
  return (
    <Link href={`/app/products/${product?.product_id}`}>
    <div className='border  rounded-xl overflow-hidden  transition-all duration-300 group cursor-pointer'>
      <div className='relative h-56  overflow-hidden'>
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <MapPin size={64} className='text-zinc-700' />
          </div>
        )}
        
     
      </div>

      <div className='p-5'>
        <div className='mb-4'>
          <h3 className='text-xl font-semibold text-white mb-2'>
            {product.name}
          </h3>
          <p className='text-sm text-zinc-500 line-clamp-2'>
            {product.description}
          </p>
        </div>

        <div className='border-t  pt-4'>
          <div className='flex items-start gap-3'>
            <div className='w-12 h-12 rounded-lg border  overflow-hidden'>
              {product.location_img_url ? (
                <img 
                  src={product.location_img_url} 
                  alt={product.location_name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <MapPin size={20} className='text-zinc-700' />
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white mb-1'>
                {product.location_name}
              </p>
              <p className='text-xs text-zinc-600 line-clamp-1'>
                {product.location_address}
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between pt-4 mt-4 border-t '>
          <span className='text-xs text-zinc-600'>ID: {product.product_id}</span>
          <div className='flex items-center gap-1.5'>
            <div className={`w-1.5 h-1.5 rounded-full ${product.qty && product.qty > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className='text-xs text-zinc-600'>
              {product.qty && product.qty > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default ProductCard