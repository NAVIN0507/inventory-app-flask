"use client"
import { useUser } from '@/hooks/use-user'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
    const {isAuthenticated}  = useUser();
    if(!isAuthenticated) return window.location.href = "/sign-in"
  return (
    <div>
        {children}
    </div>
  )
}

export default Layout