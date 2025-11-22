"use client"
import LocationCard from '@/components/location-card';
import { Button } from '@/components/ui/button';
import { useLocations } from '@/hooks/use-locations';
import { useUser } from '@/hooks/use-user';
import { LoaderPinwheelIcon, Plus } from 'lucide-react';
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddLocationForm from '@/components/add-location-form';
const page = () => {
      const {user , loading} = useUser();
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
    <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
        <h1 className='text-xl'>My Warehouses ({location_count})</h1>
<Dialog>
  <DialogTrigger asChild>
    <Button className='border rounded-lg' variant={"secondary"}>
            <Plus/> Add WareHouse
        </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle></DialogTitle>
  <AddLocationForm/>
  </DialogContent>
</Dialog>
        
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-5 gap-4'>
            {locations.map((location => <LocationCard count={location_count} location={location} key={location.location_id}/>))}
        </div>
    </div>
  )
}

export default page