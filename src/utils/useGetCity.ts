import { useState, useEffect } from "react";
import { useLocationStore } from "../store/locationStore";

interface CityData {
  city: any;
}

interface HookReturn {
  city: string | null;
  isLoading: boolean;
  error: Error | null;
}

const useFetchCity = (): HookReturn => {
  const [city, setCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const apiKey = '65f6c5ef44a45833096402fyn5ac7f1';
  const { latitude, longitude } = useLocationStore();


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey}`
        );
        const data: any = await response.json();
        setCity(data.address.city);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    city,
    isLoading,
    error,
  };
};

export default useFetchCity;
