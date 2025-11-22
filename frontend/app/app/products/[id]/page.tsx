"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LoaderPinwheelIcon, Edit, Trash2, Save, X, MapPin, Package, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { useLocations } from '@/hooks/use-locations'
import { toast } from 'sonner'

type Product = {
  product_id: number;
  name: string;
  description: string;
  image_url: string;
  qty: number | null;
  located_in: number;
  location_name?: string;
  location_address?: string;
  created_by: number;
  location_img_url:string;
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { locations } = useLocations(user?.user_id);
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [originalLocationId, setOriginalLocationId] = useState<string>(''); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    located_in: '',
    image_url: '',
    qty: ''
  });

  useEffect(() => {
    if (productId && user) {
      fetchProduct();
    }
  }, [productId, user]);

  useEffect(() => {
    if (locations && locations.length > 0 && product) {
      const matchedLocation = locations.find(loc => loc.name === product.location_name);
      if (matchedLocation) {
        setFormData(prev => ({
          ...prev,
          located_in: matchedLocation.location_id.toString()
        }));
        setOriginalLocationId(matchedLocation.location_id.toString());
      }
    }
  }, [locations, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getproductbyId/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const result = await response.json();
      
      if (result.product === 0) {
        alert(result.message);
        router.push('/app/products');
        return;
      }

      const productData = result.products;
      setProduct({
        product_id: Number(productId),
        name: productData.name,
        description: productData.description,
        image_url: productData.image_url,
        qty: productData.qty,
        located_in: 0, 
        location_name: productData.location_name,
        location_address: productData.location_address,
        created_by: 0,
        location_img_url:productData.location_img_url
      });
      
      setFormData({
        name: productData.name,
        description: productData.description,
        located_in: '', 
        image_url: productData.image_url || '',
        qty: productData.qty?.toString() || '0'
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const locationChanged = originalLocationId !== formData.located_in;
      
      if (locationChanged) {
        const movementResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_movement/addProductMovement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: Number(productId),
            from_location: Number(originalLocationId),
            to_location: Number(formData.located_in),
            qty: Number(formData.qty),
            created_by: user?.user_id
          })
        });

        if (!movementResponse.ok) {
          throw new Error('Failed to create product movement');
        }

        const movementData = await movementResponse.json();


        alert('Product moved successfully!');
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/updateProduct/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const data = await response.json();
       toast.success("Product updated Successfully")
      }
      
      setIsEditing(false);
      fetchProduct();
    } catch (error) {
      toast.error("Oops something went wrong !")
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/deleteProduct/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const data = await response.json();
      toast.success("Product Deleted Succesfully" , {
        position:"bottom-right"
      })
      router.push('/app/products');
    } catch (error) {
    toast.error("Oops something went wrong !" , {
      position:"bottom-right"
    })  
    }
  };

  if (userLoading || loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <LoaderPinwheelIcon className='animate-spin' size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-zinc-400 mb-4'>Product not found</p>
          <Button onClick={() => router.push('/products')} className='bg-green-500 hover:bg-green-600 text-black'>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-white'>Product Details</h1>
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
                  className=' text-white font-medium'
                  variant={"secondary"}
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
                    name: product.name,
                    description: product.description,
                    located_in: originalLocationId,
                    image_url: product.image_url || '',
                    qty: product.qty?.toString() || '0'
                  });
                }}
                className='bg-zinc-900 hover:bg-zinc-800 text-white border '
              >
                <X size={18} />
                <span>Cancel</span>
              </Button>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 '>
          <Card className='  p-6 rounded-none rounded-l-2xl'>
            <h2 className='text-xl font-bold text-white mb-4'>Product Information</h2>
            <div className='relative h-64 bg-zinc-900 rounded-lg overflow-hidden mb-4'>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center'>
                  <Package size={72} className='text-zinc-700' />
                </div>
              )}
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide mb-1'>Product Name</p>
                <p className='text-lg font-semibold text-white'>{product.name}</p>
              </div>

              <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide mb-1'>Description</p>
                <p className='text-sm text-zinc-400'>{product.description}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-zinc-500 uppercase tracking-wide mb-1'>Quantity</p>
                  <div className='flex items-center gap-2'>
                    <Package size={16} className='text-green-500' />
                    <p className='text-lg font-bold text-white'>{product.qty || 0}</p>
                  </div>
                </div>

                <div>
                  <p className='text-xs text-zinc-500 uppercase tracking-wide mb-1'>Status</p>
                  <div className='flex items-center gap-2'>
                    <div className={`w-2 h-2 rounded-full ${product.qty && product.qty > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className='text-sm text-zinc-400'>
                      {product.qty && product.qty > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              </div>

              {product.location_name && (
                <div className='border-t  pt-4'>
                  <p className='text-xs text-zinc-500 uppercase tracking-wide mb-2'>Location</p>
                  <div className='flex items-start gap-2'>
                    {product.location_img_url ?  (
                        <img src={product.location_img_url} className='size-10 rounded-xl' alt="" />
                    ) : (
                    <MapPin size={16} className='text-green-500 mt-1 flex-shrink-0' />)}
                    <div>
                      <p className='text-sm font-medium text-white'>{product.location_name}</p>
                      <p className='text-xs text-zinc-500'>{product.location_address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className=' p-6 rounded-none rounded-r-2xl'>
            <h2 className='text-xl font-bold text-white mb-4'>
              {isEditing ? 'Edit Product' : 'Product Form'}
            </h2>

            <form onSubmit={handleUpdate} className='space-y-4'>
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
                  disabled={!isEditing}
                  required
                  className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <label htmlFor="description" className='text-sm font-medium text-zinc-300'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  rows={4}
                  className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>

              {/* Location */}
              <div className='space-y-2'>
                <label htmlFor="located_in" className='text-sm font-medium text-zinc-300'>
                  Location <span className='text-red-500'>*</span>
                </label>
                <select 
                  id="located_in"
                  name="located_in"
                  value={formData.located_in}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className='w-full px-4 py-2.5 mt-2 border bg-sidebar  rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <option value="">Select a location</option>
                  {locations?.map((location) => (
                    <option key={location.location_id} value={location.location_id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
                {isEditing && originalLocationId !== formData.located_in && formData.located_in && (
                  <p className='text-xs text-yellow-500 mt-1'>
                    ⚠️ Changing location will move the entire product quantity to the new location
                  </p>
                )}
              </div>

              {/* Image URL */}
              <div className='space-y-2'>
                <label htmlFor="image_url" className='text-sm font-medium text-zinc-300'>
                  Image URL
                </label>
                <input 
                  type="url" 
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>

              {/* Quantity */}
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
                  disabled={!isEditing}
                  required
                  min="0"
                  className='w-full px-4 py-2.5 mt-2 border  rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>

              {/* Submit Button */}
              {isEditing && (
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className='w-full bg-green-500 hover:bg-green-600 text-black font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {submitting ? (
                    <span className='flex items-center justify-center gap-2'>
                      <LoaderPinwheelIcon className='animate-spin' size={18} />
                      {originalLocationId !== formData.located_in ? 'Moving Product...' : 'Updating Product...'}
                    </span>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{originalLocationId !== formData.located_in ? 'Move Product' : 'Save Changes'}</span>
                    </>
                  )}
                </Button>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page