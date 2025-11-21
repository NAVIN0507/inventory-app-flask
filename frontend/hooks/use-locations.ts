"use client"
import { useEffect, useState } from "react";
import { fetchLocationsByUser } from "@/lib/actions/location.actions";


export type Location = {
  address: string;
  name: string;
  location_id: number;
  image_url?: string;
};

type LocationsResponse = {
  location_count: number;
  locations: Location[];
};

export const useLocations = (user_id?: number) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [location_count, setLocationCount] = useState<number>(0);

  useEffect(() => {
    if (!user_id) return; // prevents invalid fetch

    const loadLocations = async () => {
      const response = await fetchLocationsByUser(user_id);
      setLocations(response.data?.locations || []);
      setLocationCount(response.data?.location_count || 0);
    };

    loadLocations();
  }, [user_id]);

  return { locations, location_count };
};
