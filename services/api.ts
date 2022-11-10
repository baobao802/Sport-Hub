import localStore from '@utils/local-storage';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import https from 'https';

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const accessToken = localStore.getItem('accessToken');
  if (accessToken) {
    config.headers!['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (
  error: AxiosError,
): Promise<AxiosResponse | AxiosError> => {
  const originalRequest = error.config;
  if (error.response) {
    if ((error.response.data as any)?.message === 'Token expired') {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {
            withCredentials: true,
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
          },
        );
        return axios(originalRequest);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
  }
  return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

const api = setupInterceptorsTo(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  }),
);

export default api;

export const fetcher = (url: string) => api.get(url).then((res) => res.data);
