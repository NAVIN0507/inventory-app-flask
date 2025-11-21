"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading  , user} = useUser();
  const router = useRouter();

  // Handle redirect safely
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return null; // prevent rendering page before redirect
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      
      <main className="w-full m-2">
        <div className="  rounded-md  p-4">
            <div className="flex items-center gap-2 ">

            <div className='flex flex-col mt-4 gap-1 pb-4'>
                <div className="flex items-center gap-2">
        <h1 className='text-xl'>Welcome <span className="text-primary"> {user?.name} </span></h1>
        <SidebarTrigger className="size-8"/>
        </div>
        <p className="text-xs font-bold">Control your warhouses and products in Smarter way.</p>
      </div>
            </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
