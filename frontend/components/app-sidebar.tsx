"use client"
import { Calendar, Home, Inbox, Map, Search, Settings, SettingsIcon, ShoppingBag, ShoppingCartIcon, Warehouse } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"
import {Warehouses} from "./ware-houses"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: Home,
  },
  {
    title: "Locations",
    url: "/app/locations",
    icon: Map,
  },
  {
    title: "Products",
    url: "/app/products",
    icon: ShoppingBag,
  },
  
]

export function AppSidebar() {
    const pathname = usePathname();
    const {user}  = useUser();
  return (
    <Sidebar className="space-y-1" >
    <SidebarHeader className="border m-2 p-5 rounded-xl">
        <SidebarContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="">
                    <ShoppingCartIcon size={40} className="border p-2 rounded-xl"/>
                    </div>
                    <div className="flex flex-col">
                <h1 className="text-xl font-mono">InventoryPro</h1>
                <p className="text-xs">Organize your Products</p>
                </div>
                </div>
            </div>
        </SidebarContent>
        </SidebarHeader>
     <SidebarContent className="m-4 mt-4">
             <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActieve = pathname === item.url 
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={isActieve ?  "bg-primary text-black" :""}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
 )})}
            </SidebarMenu>
          </SidebarGroupContent>
          <hr  className="mt-2"/>
          <div className="flex items-center gap-2 mt-2">
            <Warehouse size={18}/>
            Ware Houses
          </div>
          <Warehouses/>
        </SidebarContent>
        <SidebarFooter className="m-2 border p-2 h-fit rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
            <p>{user?.name}</p>
            <p className="text-sm">{user?.email}</p>
            </div>
        </SidebarFooter>
        <Link href={"/app/settings"}>
        <SidebarFooter className="m-2 border p-2 h-fit rounded-xl flex flex-row items-center justify-center gap-3 cursor-pointer">
            Account Settings <SettingsIcon size={18}/>
        </SidebarFooter>
        </Link>
    </Sidebar>
  )
}