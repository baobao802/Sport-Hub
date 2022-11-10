import type { AppProps } from 'next/app';
import { FC } from 'react';
import { SessionProvider } from 'next-auth/react';
import { GlobalProvider } from 'contexts/global';
import 'antd/dist/antd.css';
import '../styles/globals.css';
import moment from 'moment';
import 'moment/locale/vi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';

moment().locale('vi');
const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps,
}: AppProps<{ session: Session }> & { Component: { Layout: FC<any> } }) {
  if (!Component.Layout) {
    return (
      <SessionProvider session={pageProps.session}>
        <GlobalProvider>
          <Component {...pageProps} />
        </GlobalProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={pageProps.session}>
      <GlobalProvider>
        <QueryClientProvider client={queryClient}>
          <Component.Layout>
            <Component {...pageProps} />
          </Component.Layout>
        </QueryClientProvider>
      </GlobalProvider>
    </SessionProvider>
  );
}

export default MyApp;

//https://api.geoapify.com/v1/geocode/reverse?lat=21.0278&lon=105.8342&type=city&format=json&apiKey=079f6c0fdcca4313841d1fd53a153a17
//https://api.geoapify.com/v1/ipinfo?apiKey=079f6c0fdcca4313841d1fd53a153a17
