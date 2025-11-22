"use client"
import React, { useState } from 'react'
import { Card } from './ui/card'
import { useUser } from '@/hooks/use-user'
import { LoaderPinwheelIcon, MapPin, Upload, X } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'

const AddLocationForm = () => {
    const {loading , user}  = useUser();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        image_url: ''
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/location/addlocation/${user.user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add location');
            }

            const data = await response.json();
            
          toast.success("Warehouse added Successfully !" , {
            position:"bottom-right"
          })
            setFormData({
                name: '',
                address: '',
                image_url: ''
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error("Sorry some thing went wrong." , {
                position:"bottom-right"
            })
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='  p-6'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-white mb-2'>Add New Warehouse</h2>
                <p className='text-sm text-zinc-500'>Create a new warehouse or storage location</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                    <label htmlFor="name" className='text-sm font-medium text-zinc-300'>
                        Warehouse Name <span className='text-red-500'>*</span>
                    </label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder='Enter location name (e.g., Main Warehouse)'
                        className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors'
                    />
                </div>

                <div className='space-y-2'>
                    <label htmlFor="address" className='text-sm font-medium text-zinc-300'>
                        Address <span className='text-red-500'>*</span>
                    </label>
                    <textarea 
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder='Enter full address with city, state, and postal code'
                        className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors resize-none'
                    />
                </div>

                <div className='space-y-2'>
                    <label htmlFor="image_url" className='text-sm font-medium text-zinc-300'>
                        Image URL
                    </label>
                    <div className='relative'>
                        <input 
                            type="url" 
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder='https://example.com/location-image.jpg'
                            className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors'
                        />
                        <Upload size={18} className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600' />
                    </div>
                    <p className='text-xs text-zinc-600'>Optional: Add an image URL for this location</p>
                </div>

               
               
                <div className='flex gap-3 pt-4'>
                    <Button 
                        type="submit" 
                        disabled={submitting}
                        className='flex-1 bg-green-500 hover:bg-green-600 text-black font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {submitting ? (
                            <span className='flex items-center justify-center gap-2'>
                                <LoaderPinwheelIcon className='animate-spin' size={18} />
                                Adding Location...
                            </span>
                        ) : (
                            'Add Location'
                        )}
                    </Button>
                    
                </div>
            </form>
        </div>
    )
}

export default AddLocationForm