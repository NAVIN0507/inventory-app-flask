"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LoaderPinwheelIcon, Edit, Trash2, Save, X, MapPin, Package, ArrowLeft, Upload, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import Link from 'next/link'
import { toast } from 'sonner'

type Location = {
  location_id: number;
  name: string;
  address: string;
  image_url?: string;
};

type Product = {
  product_id: number;
  name: string;
  description: string;
  image_url: string;
  qty: number | null;
  location_name: string;
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const locationId = params.id;

  const [location, setLocation] = useState<Location | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    image_url: ''
  });

  // Fetch location details
  useEffect(() => {
    if (locationId && user) {
      fetchLocation();
      fetchProducts();
    }
  }, [locationId, user]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/api/location/getlocationbyid/${locationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }

      const result = await response.json();
      
      if (!result.location) {
        alert(result.message || 'Location not found');
        router.push('/locations');
        return;
      }

      const locationData = result.location;
      setLocation({
        location_id: Number(locationId),
        name: locationData.name,
        address: locationData.address,
        image_url: locationData.image_url
      });
      
      setFormData({
        name: locationData.name,
        address: locationData.address,
        image_url: locationData.image_url || ''
      });
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Failed to load location details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // You'll need to provide this endpoint to get products by location
      const response = await fetch(`http://127.0.0.1:5000/api/product/getproductsbylocation/${locationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      setProducts(result.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/location/updatelocation/${locationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      const data = await response.json();
      toast.success("Location Updated Successfully" , )
      setIsEditing(false);
      fetchLocation();
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error updating location. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
   

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/location/deletelocation/${locationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }

      const data = await response.json();
      toast.error(data.message || 'Location deleted successfully!' , {
        position:"bottom-right"
      });
      router.push('/app/locations');
    } catch (error) {
      toast.error('Error deleting location. Please try again.');
    }
  };

  if (userLoading || loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <LoaderPinwheelIcon className='animate-spin' size={40} />
      </div>
    );
  }

  if (!location) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-zinc-400 mb-4'>Location not found</p>
          <Button onClick={() => router.push('/locations')} className='bg-green-500 hover:bg-green-600 text-black'>
            Back to Locations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen  p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>

            <div>
              <h1 className='text-3xl font-bold '>Warehouse Details</h1>
              
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {!isEditing ? (
              <>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className='bg-green-500 hover:bg-green-600 text-black font-medium'
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </Button>
                <Button 
                  onClick={handleDelete}
                  variant={"secondary"}
                  className='  font-medium'
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: location.name,
                    address: location.address,
                    image_url: location.image_url || ''
                  });
                }}
                className='bg-zinc-900 hover:bg-zinc-800  border '
              >
                <X size={18} />
                <span>Cancel</span>
              </Button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
         
          <Card className='  p-6'>
            <h2 className='text-xl font-bold  mb-4'>Location Information</h2>
            
            <div className='relative h-48 bg-zinc-900 rounded-lg overflow-hidden mb-4'>
              {location.image_url ? (
                <img 
                  src={location.image_url} 
                  alt={location.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <MapPin size={72} className='text-zinc-700' />
                </div>
              )}
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide mb-1'>Location Name</p>
                <p className='text-lg font-semibold '>{location.name}</p>
              </div>

              <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide mb-1'>Address</p>
                <div className='flex items-start gap-2'>
                  <MapPin size={16} className='text-green-500 mt-1 flex-shrink-0' />
                  <p className='text-sm text-zinc-400'>{location.address}</p>
                </div>
              </div>

              <div className='border-t  pt-4'>
                <p className='text-xs text-zinc-500 uppercase tracking-wide mb-2'>Products Count</p>
                <div className='flex items-center gap-2'>
                  <Package size={16} className='text-green-500' />
                  <p className='text-lg font-bold '>{products.length}</p>
                  <span className='text-sm text-zinc-500'>products stored here</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className=' p-6'>
            <h2 className='text-xl font-bold  mb-4'>
              Edit Warehouse Details
            </h2>

            <form onSubmit={handleUpdate} className='space-y-4'>
              {/* Location Name */}
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
                  disabled={!isEditing}
                  required
                  placeholder='Enter location name'
                  className='w-full px-4 py-2.5 mt-2 border  rounded-lg  placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>

              {/* Address */}
              <div className='space-y-2'>
                <label htmlFor="address" className='text-sm font-medium text-zinc-300'>
                  Address <span className='text-red-500'>*</span>
                </label>
                <textarea 
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  rows={3}
                  placeholder='Enter full address'
                  className='w-full px-4 py-2.5 mt-2 border  rounded-lg  placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>

              {/* Image URL */}
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
                    disabled={!isEditing}
                    placeholder='https://example.com/image.jpg'
                    className='w-full px-4 py-2.5 mt-2 border  rounded-lg  placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  />
                  <Upload size={18} className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600' />
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className='w-full bg-green-500 hover:bg-green-600 text-black font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4'
                >
                  {submitting ? (
                    <span className='flex items-center justify-center gap-2'>
                      <LoaderPinwheelIcon className='animate-spin' size={18} />
                      Updating Location...
                    </span>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              )}
            </form>
          </Card>
        </div>

        <Card className='  p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold  mb-1'>Products in this Location</h2>
              <p className='text-sm text-zinc-500'>All products stored at {location.name}</p>
            </div>
           
          </div>

          {products.length === 0 ? (
            <div className='text-center py-12'>
              <Package size={48} className='mx-auto text-zinc-700 mb-4' />
              <p className='text-zinc-500 mb-2'>No products in this warehouse</p>
              <p className='text-sm text-zinc-600'>Add products to get started</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b '>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>Image</th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>Product Name</th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>Description</th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>Quantity</th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>Status</th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>Link</th>

                  </tr>
                  
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.product_id} className='border-b   transition-colors'>
                       
                      <td className='py-4 px-4'>
                        <div className='w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden'>
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className='w-full h-full object-cover' />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                              <Package size={20} className='text-zinc-700' />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='py-4 px-4'>
                        <p className='font-medium '>{product.name}</p>
                      </td>
                      <td className='py-4 px-4'>
                        <p className='text-sm text-zinc-400 line-clamp-2 max-w-xs'>{product.description}</p>
                      </td>
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <Package size={16} className='text-green-500' />
                          <span className='font-semibold '>{product?.qty || 0}</span>
                        </div>
                      </td>
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <div className={`w-2 h-2 rounded-full ${product.qty && product.qty > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className='text-sm text-zinc-400'>
                            {product.qty && product.qty > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>
                     <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <Link href={`/app/products/${product?.product_id}`}>
<ArrowRight/>
</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Page