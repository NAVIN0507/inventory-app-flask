import { ModeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import React from 'react'
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { ArrowRight, Package, Warehouse, BarChart3, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <Hero />
      <Features />
      <Footer/>
    </div>
  )
}

export default Page

const Navbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 border-b  backdrop-blur-xl'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
      <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className="p-2 bg-green-500 rounded-lg">
              <Package size={20} className="text-black" />
            </div>
            <span className='text-xl font-bold text-white'>InventoryPro</span>
          </div>
          <div className='flex items-center gap-4'>
            <Link href='/app'>
              <Button className='bg-primary text-black font-medium'>
                Login
              </Button>
            </Link>
           
          </div>
        </div>
      </div>
    </nav>
  )
}

const Hero = () => {
  return (
    <div className='relative pt-20'>
      <div className='relative'>
        <ContainerScroll
          titleComponent={
            <div className='flex flex-col items-center text-center px-4'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full mb-8'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                <span className='text-sm text-zinc-400'>Modern Inventory Management</span>
              </div>

              <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 max-w-5xl'>
                Organize Your Warehouses
                <br />
                <span className='text-primary bg-clip-text '>
                  In A Smarter Way
                </span>
              </h1>

              <p className='text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl'>
                Streamline your inventory operations with real-time tracking, 
                 and powerful analytics all in one place.
              </p>

              <div className='flex flex-col sm:flex-row items-center gap-4 mb-16'>
                <Link href='/app'>
                  <Button className='bg-primary text-black font-medium px-8 py-6 text-lg rounded-xl'>
                    Get Started 
                    <ArrowRight size={20} />
                  </Button>
                </Link>
                
              </div>
            </div>
          }
        >
          <div className='relative'>
            <div className='absolute -inset-4  rounded-3xl blur-2xl' />
            
            <img
              src='/image.png'
              alt='InventoryPro Dashboard'
              height={720}
              width={1400}
              className='relative mx-auto rounded-2xl object-cover h-full object-left-top border border-zinc-800 shadow-2xl'
              draggable={false}
            />
          </div>
        </ContainerScroll>
      </div>
    </div>
  )
}

const Features = () => {
  const features = [
    {
      icon: <Package size={24} />,
      title: 'Product Management',
      description: 'Track inventory levels, manage SKUs, and organize products across multiple locations.'
    },
    {
      icon: <Warehouse size={24} />,
      title: 'Multi-Warehouse',
      description: 'Manage multiple warehouses and distribution centers from a single dashboard.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Analytics & Reports',
      description: 'Get real-time insights into stock levels, movements, and inventory performance.'
    }
  ]

  return (
    <div className='relative py-24 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-5xl font-bold text-white mb-4'>
            Everything You Need
          </h2>
          <p className='text-lg text-zinc-400 max-w-2xl mx-auto'>
            Powerful features to help you manage your inventory efficiently
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <div 
              key={index}
              className='group p-8 border border-zinc-800 rounded-2xl  transition-all duration-300'
            >
              <div className='w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center '>
                {feature.icon}
              </div>
              <h3 className='text-xl font-semibold text-white mb-3'>
                {feature.title}
              </h3>
              <p className='text-zinc-400 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const Footer = () => {
  return (
    <footer className="border-t  py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Package size={20} className="text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              InventoryPro
            </span>
          </div>

         
        </div>

        <div className="border-t border-zinc-800  my-2"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-zinc-600 text-sm gap-4">

          <p>© {new Date().getFullYear()} InventoryPro. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};