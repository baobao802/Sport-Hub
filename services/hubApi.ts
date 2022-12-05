import localStore from '@utils/local-storage';
import axios from 'axios';
import _ from 'lodash';
import { Pitch } from 'types';
import api from './api';

export type HubRequestParams = {
  cityId?: string;
};

export type PitchRequestParams = {
  cityId?: string;
  date?: string;
  time?: string;
  type?: string;
  search?: string;
};

export async function getAllHubs(params?: HubRequestParams) {
  return api.get('/hubs', { params }).then((res) => res.data);
}

export async function getHubById(id: string) {
  return api.get(`/hubs/${id}`).then((res) => {
    const cities = localStore.getItem('cities');
    if (!cities) {
      return res.data;
    }
    const foundCity = _.find(cities, (city) =>
      _.find(city.districts, ({ id }) => id === res.data.address.district.id),
    );
    return {
      ...res.data,
      address: {
        ...res.data.address,
        city: foundCity,
      },
    };
  });
}

export async function getAllAvailablePitches(params: PitchRequestParams) {
  return api
    .get<Pitch[]>('/available-pitches', { params })
    .then((res) => res.data);
}
