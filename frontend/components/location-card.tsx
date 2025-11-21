import React from 'react'
import { MapPin, Package } from 'lucide-react'
import Link from 'next/link';

type Location = {
  address: string;
  name: string;
  location_id: number;
  image_url?: string;
};

interface Props{
    count:number;
    location:Location
}

const LocationCard = ({count , location}:Props) => {
  return (
    <Link href={`/app/locations/${location.location_id}`}>
    <div className='border border-zinc-800  rounded-xl overflow-hidden   group cursor-pointer'>
      {/* Image Section */}
      <div className='relative h-48 bg-zinc-900 overflow-hidden'>
        {location.image_url ? (
          <img 
            src={location.image_url} 
            alt={location.name}
            className='w-full h-full object-cover '
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <MapPin size={64} className='text-zinc-700' />
          </div>
        )}
        
      </div>

      {/* Content Section */}
      <div className='p-5'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-white mb-2'>
              {location.name}
            </h3>
            <div className='flex items-start gap-2'>
              <MapPin size={16} className='text-zinc-600 mt-0.5 flex-shrink-0' />
              <p className='text-sm text-zinc-500 line-clamp-2'>
                {location.address}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between pt-3 border-t border-zinc-800'>
          <span className='text-xs text-zinc-600'>ID: {location.location_id}</span>
          <div className='flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
            <span className='text-xs text-zinc-600'>Active</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default LocationCard