"use client"
import React, { useState, useEffect } from 'react'
import { LoaderPinwheelIcon, ArrowRight, Package, MapPin, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useUser } from '@/hooks/use-user'

type ProductMovement = {
  movement_id: number;
  product_id: number;
  from_location: number;
  to_location: number;
  qty: number;
  created_by: number;
  product_name?: string;
  product_image?: string;
  from_location_name?: string;
  to_location_name?: string;
  created_at?: string;
};

const ProductMovementsTable = () => {
  const { user, loading: userLoading } = useUser();
  const [movements, setMovements] = useState<ProductMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrichedMovements, setEnrichedMovements] = useState<ProductMovement[]>([]);

  useEffect(() => {
    if (user?.user_id) {
      fetchProductMovements();
    }
  }, [user]);

  const fetchProductMovements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product_movement/${user?.user_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product movements');
      }

      const result = await response.json();
      const movementsData = result['Product Movements'] || [];
      setMovements(movementsData);

      // Enrich movements with product and location details
      await enrichMovementsData(movementsData);
    } catch (error) {
      console.error('Error fetching product movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrichMovementsData = async (movementsData: ProductMovement[]) => {
    const enriched = await Promise.all(
      movementsData.map(async (movement) => {
        try {
          // Fetch product details
          const productResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/product/getproductbyId/${movement.product_id}`
          );
          const productData = await productResponse.json();
          
          // Fetch from location details
          const fromLocationResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}location/getlocationbyid/${movement.from_location}`
          );
          const fromLocationData = await fromLocationResponse.json();

          // Fetch to location details
          const toLocationResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/location/getlocationbyid/${movement.to_location}`
          );
          const toLocationData = await toLocationResponse.json();

          return {
            ...movement,
            product_name: productData.products?.name || 'Unknown Product',
            product_image: productData.products?.image_url || '',
            from_location_name: fromLocationData.location?.name || 'Unknown Location',
            to_location_name: toLocationData.location?.name || 'Unknown Location',
          };
        } catch (error) {
          console.error('Error enriching movement data:', error);
          return movement;
        }
      })
    );

    setEnrichedMovements(enriched);
  };

  if (userLoading || loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <LoaderPinwheelIcon className='animate-spin' size={40} />
      </div>
    );
  }

  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-white mb-2'>Recent Product Movements</h1>
          <p className='text-sm text-zinc-500'>Track all product transfers between locations</p>
        </div>


        {/* Movements Table */}
        <Card className='  p-6'>
          <div className='mb-4'>
            <h2 className='text-xl font-bold text-white'>Movement History</h2>
          </div>

          {enrichedMovements.length === 0 ? (
            <div className='text-center py-12'>
              <ArrowRight size={48} className='mx-auto text-zinc-700 mb-4' />
              <p className='text-zinc-500 mb-2'>No product movements recorded</p>
              <p className='text-sm text-zinc-600'>Product transfers will appear here</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b '>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>
                      Movement ID
                    </th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>
                      Product
                    </th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>
                      From Location
                    </th>
                    <th className='text-center py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>
                      
                    </th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>
                      To Location
                    </th>
                    <th className='text-left py-3 px-4 text-sm font-medium text-zinc-400 uppercase tracking-wide'>
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedMovements.map((movement) => (
                    <tr 
                      key={movement.movement_id} 
                      className='border-b bg-sidebar  hover:bg-zinc-900/50 transition-colors'
                    >
                      {/* Movement ID */}
                      <td className='py-4 px-4'>
                        <span className='text-sm font-mono text-zinc-400'>
                          #{movement.movement_id}
                        </span>
                      </td>

                      {/* Product */}
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0'>
                            {movement.product_image ? (
                              <img 
                                src={movement.product_image} 
                                alt={movement.product_name} 
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <Package size={18} className='text-zinc-700' />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className='font-medium text-white text-sm'>
                              {movement.product_name || 'Loading...'}
                            </p>
                            <p className='text-xs text-zinc-500'>
                              ID: {movement.product_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* From Location */}
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <MapPin size={16} className='text-red-500 flex-shrink-0' />
                          <span className='text-sm text-white'>
                            {movement.from_location_name || 'Loading...'}
                          </span>
                        </div>
                      </td>

                      {/* Arrow */}
                      <td className='py-4 px-4 text-center'>
                        <ArrowRight size={20} className='text-green-500 mx-auto' />
                      </td>

                      {/* To Location */}
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <MapPin size={16} className='text-green-500 flex-shrink-0' />
                          <span className='text-sm text-white'>
                            {movement.to_location_name || 'Loading...'}
                          </span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className='py-4 px-4'>
                        <div className='flex items-center gap-2'>
                          <Package size={16} className='text-green-500' />
                          <span className='font-semibold text-white'>
                            {movement.qty}
                          </span>
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

export default ProductMovementsTable