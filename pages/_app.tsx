import type { AppProps } from 'next/app';
import { FC, useState } from 'react';
import { GlobalProvider } from 'contexts/global';
import 'antd/dist/antd.css';
import '../styles/globals.css';
import { City } from 'types';
import moment from 'moment';
import 'moment/locale/vi';
import { SWRConfig } from 'swr';

moment().locale('vi');

function MyApp({
  Component,
  pageProps,
}: AppProps & { Component: { Layout: FC<any> } }) {
  const [cities, setCities] = useState<City[]>([]);

  if (!Component.Layout) {
    return (
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    );
  }

  return (
    <GlobalProvider>
      <SWRConfig value={{ refreshInterval: 0, revalidateIfStale: false }}>
        <Component.Layout cities={cities}>
          <Component {...pageProps} />
        </Component.Layout>
      </SWRConfig>
    </GlobalProvider>
  );
}

export default MyApp;

//https://api.geoapify.com/v1/geocode/reverse?lat=21.0278&lon=105.8342&type=city&format=json&apiKey=079f6c0fdcca4313841d1fd53a153a17
//https://api.geoapify.com/v1/ipinfo?apiKey=079f6c0fdcca4313841d1fd53a153a17
