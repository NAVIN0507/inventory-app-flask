"use client"
import { useUser } from '@/hooks/use-user'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
    const {isAuthenticated , user} = useUser();
    if(isAuthenticated){
        return window.location.href = "/app"
    }
  return (
    <div className='h-screen flex items-center justify-center'>
        {children}
    </div>
  )
}

export default Layout