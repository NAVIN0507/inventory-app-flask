"use client";
import { useLocations } from "@/hooks/use-locations";
import { useUser } from "@/hooks/use-user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { usePathname } from "next/navigation";
import Link from "next/link";
 export const Warehouses = () => {
  const { loading, user } = useUser();
  const pathname = usePathname();
  const { locations, location_count } = useLocations(user?.user_id);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user found</p>;
  return (
    <div className="space-y-3">
      {locations.map((location) => {
        const isActive = pathname === `/app/location/${location?.location_id}`;
        return (
            <Link href={`/app/locations/${location?.location_id}`} className={`flex items-center gap-2 w-full ${isActive  ? "text-primary" :""}`} key={location?.location_id}>
            <div className="flex items-center gap-2">
                <LocationAvatar image_url={location.image_url!} name={location.name}/>
                <p>{location.name}</p>
            </div>
            </Link>
        )
      })}
    </div>
  );
};



export const LocationAvatar = ({ image_url , name }: { image_url: string; name: string }) => {
    return (
        <>
         <Avatar>
        <AvatarImage src={image_url} alt="@shadcn"  className="rounded-xl"/>
        <AvatarFallback className="rounded-xl">{name[0]}</AvatarFallback>
      </Avatar>
      
        </>
    )
}