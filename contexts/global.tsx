import React, { ReactNode, useContext, useEffect, useState } from 'react';
import type { City, GlobalContextType, User } from 'types';
import Cookies from 'js-cookie';
import api from '@services/api';
import { getGeocoding } from '@services/geoapify';
import { getLocation } from '@utils/geolocation';
import { getCities } from '@services/placeApi';
import _ from 'lodash';
import { removeVietnameseTones } from '@utils/string';

const GlobalContext = React.createContext<GlobalContextType>({
  user: null,
  isAuthenticated: false,
} as any);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCity] = useState<Omit<City, 'districts'>>();

  const login = async (credentials: any) => {
    console.log(credentials);
  };

  const logout = async () => {
    await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    setIsAuthenticated(undefined);
  };

  const fetchInitialData = async () => {
    const cities: City[] = await getCities();
    setCities(cities);
    getLocation(async (position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      const res = await getGeocoding({ lat, lon });
      const found = cities.find(
        (city) =>
          _.lowerCase(removeVietnameseTones(city.name)) ===
          _.lowerCase(res.data?.results[0].city),
      );
      found && setCurrentCity({ id: found.id, name: found.name });
    });
  };

  useEffect(() => {
    fetchInitialData();
    setUser(JSON.parse(Cookies.get('user') || 'null'));
    const loggedIn = Cookies.get('logged_in');
    setIsAuthenticated(loggedIn === 'true' ? true : false);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        login,
        logout,
        cities,
        currentCity,
        setCurrentCity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
