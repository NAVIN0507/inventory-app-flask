"use client"
import React, { useState } from 'react'
import { Card } from './ui/card'
import { useLocations } from '@/hooks/use-locations'
import { useUser } from '@/hooks/use-user'
import { LoaderPinwheelIcon, Upload, X } from 'lucide-react'
import { Button } from './ui/button'

const AddProductForm = () => {
    const {loading , user}  = useUser();
    const {locations}  = useLocations(user?.user_id);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        located_in: '',
        image_url: '',
        qty: ''
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Update this URL to match your backend endpoint
            const response = await fetch(`http://127.0.0.1:5000/api/product/addProduct/${user.user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const data = await response.json();
            
            alert(data.message || 'Product added successfully!');
            // Reset form
            setFormData({
                name: '',
                description: '',
                located_in: '',
                image_url: '',
                qty: ''
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding product. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className=' border-zinc-800 p-6'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-white mb-2'>Add New Product</h2>
                <p className='text-sm text-zinc-500'>Fill in the details to add a new product to your inventory</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                    <label htmlFor="name" className='text-sm font-medium text-zinc-300'>
                        Product Name <span className='text-red-500'>*</span>
                    </label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder='Enter product name'
                        className='w-full px-4 py-2.5 mt-2 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors'
                    />
                </div>

                <div className='space-y-2'>
                    <label htmlFor="description" className='text-sm font-medium text-zinc-300'>
                        Description <span className='text-red-500'>*</span>
                    </label>
                    <textarea 
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder='Enter product description'
                        className='w-full px-4 py-2.5 mt-2 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors resize-none'
                    />
                </div>

                <div className='space-y-2'>
                    <label htmlFor="located_in" className='text-sm font-medium text-zinc-300'>
                        Location <span className='text-red-500'>*</span>
                    </label>
                    <select 
                        id="located_in"
                        name="located_in"
                        value={formData.located_in}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2.5 mt-2 bg-sidebar border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors'
                    >
                        {locations?.map((location) => (
                            <option key={location.location_id} value={location.location_id}>
                                {location.name} - {location.address}
                            </option>
                        ))}
                    </select>
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
                            placeholder='https://example.com/image.jpg'
                            className='w-full px-4 py-2.5 mt-2 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors'
                        />
                        <Upload size={18} className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600' />
                    </div>
                </div>

                <div className='space-y-2'>
                    <label htmlFor="qty" className='text-sm font-medium text-zinc-300'>
                        Quantity <span className='text-red-500'>*</span>
                    </label>
                    <input 
                        type="number" 
                        id="qty"
                        name="qty"
                        value={formData.qty}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder='0'
                        className='w-full px-4 py-2.5 mt-2 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors'
                    />
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
                                Adding Product...
                            </span>
                        ) : (
                            'Add Product'
                        )}
                    </Button>
                  
                </div>
            </form>
        </div>
    )
}

export default AddProductForm