import React, { ReactNode, useContext, useEffect, useState } from 'react';
import type { City, GlobalContextType } from 'types';
import { getGeocoding } from '@services/geoapify';
import { getLocation } from '@utils/geolocation';
import { getCities } from '@services/placeApi';
import _ from 'lodash';
import { removeVietnameseTones } from '@utils/string';
import localStore from '@utils/local-storage';
import { LocalStorageVars } from 'constant';

const GlobalContext = React.createContext<GlobalContextType>({
  cities: [],
  currentCity: null,
} as any);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCity] = useState<City | null>(null);

  const changeCurrentCity = (city: City) => {
    setCurrentCity(city);
    localStore.setItem(LocalStorageVars.currentCity, city);
  };

  const fetchInitialData = async () => {
    if (!cities || _.size(cities) === 0) {
      const citiesRes = await getCities();
      setCities(citiesRes);
      localStore.setItem(LocalStorageVars.cities, citiesRes);
    }

    getLocation(async (position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      const res = await getGeocoding({ lat, lon });
      const foundCity = localStore
        .getItem(LocalStorageVars.cities)
        .find(
          (city: any) =>
            _.lowerCase(removeVietnameseTones(city.name)) ===
            _.lowerCase(res.data?.results[0].city),
        );

      if (foundCity) {
        setCurrentCity(foundCity);
        if (!currentCity || (currentCity && currentCity.id !== foundCity.id)) {
          localStore.setItem(LocalStorageVars.currentCity, foundCity);
        }
      }
    });
  };

  useEffect(() => {
    const storedCities = localStore.getItem(LocalStorageVars.cities);
    const storedCurrentCity = localStore.getItem(LocalStorageVars.currentCity);
    storedCities && setCities(storedCities);
    storedCurrentCity && setCurrentCity(storedCurrentCity);
    fetchInitialData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        cities,
        currentCity,
        changeCurrentCity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
