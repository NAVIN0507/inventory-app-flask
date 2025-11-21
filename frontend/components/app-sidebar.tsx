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
  useSidebar,
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
    const { state, open } = useSidebar();
    const isCollapsed = state === "collapsed";
    
  return (
    <Sidebar className="space-y-1" collapsible="icon">
      <SidebarHeader className={`border m-2 rounded-xl ${isCollapsed ? "border-none" : ""}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center ' : 'justify-between p-2'}`}>
          <div className={`flex items-center ${isCollapsed ? '' : 'gap-4'}`}>
            <ShoppingCartIcon size={isCollapsed ? 34 : 40} className="border p-2 rounded-xl"/>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-xl font-mono">InventoryPro</h1>
                <p className="text-xs">Organize your Products</p>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className={`${isCollapsed ? 'mx-2' : 'm-4'} mt-4`}>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.url 
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={isActive ? "bg-primary text-black" : ""}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
        
        {!isCollapsed && (
          <>
            <hr className="mt-2"/>
            <div className="flex items-center gap-2 mt-2">
              <Warehouse size={18}/>
              <span>Ware Houses</span>
            </div>
            <div className="m-2">
            <Warehouses/>
            </div>
          </>
        )}
        
        {isCollapsed && (
          <SidebarMenuButton 
            tooltip="Warehouses"
            className="mt-4"
            asChild
          >
            <div>
              <Warehouse size={18}/>
              <span>Warehouses</span>
            </div>
          </SidebarMenuButton>
        )}
      </SidebarContent>
      
      <SidebarFooter className={`m-2 border ${isCollapsed ? 'p-2 border-none' : 'p-4'} h-fit rounded-xl`}>
        {!isCollapsed ? (
          <div className="flex flex-col">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full ">
            <div className="w-6 h-6 rounded-full bg-primary flex  p-2 items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </SidebarFooter>
      
      <Link href={"/app/settings"}>
        <SidebarFooter className={`m-2 border ${isCollapsed ? 'p-2' : 'p-4'} h-fit rounded-xl cursor-pointer hover:bg-accent transition-colors`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-3'}`}>
            <SettingsIcon size={18}/>
            {!isCollapsed && <span>Account Settings</span>}
          </div>
        </SidebarFooter>
      </Link>
    </Sidebar>
  )
}