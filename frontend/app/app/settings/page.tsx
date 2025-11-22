"use client"
import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user'
import { LogOut } from 'lucide-react';
import React from 'react'

const SettingsPage = () => {
  const logout = ()=>{
    localStorage.removeItem("token")
    window.location.href="/sign-in"
  }
  const {user}  = useUser();
  return (
    <div className='m-3 p-3 w-full h-fit border rounded-lg'>
      <div className='flex flex-col gap-2 m-3'>
        <div className='bg-primary p-2 w-10 h-10 rounded-md items-center flex justify-center text-black'>
          {user?.name[0]}
        </div>
        <div className='flex flex-col'>
          <h1 className='uppercase text-xl'>{user?.name}</h1>
          <p className='text-sm'>{user?.email}</p>
        </div>
        <div className='flex flex-row gap-2 items-center'>
        <Button className='w-fit border cursor-pointer' variant={"destructive"}  onClick={logout}>Logout
          <LogOut/>
        </Button>
        <ModeToggle/>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage