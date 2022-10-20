import _ from 'lodash';
import api from './api';

export type RequestParams = {
  city?: string;
};

export async function getAllHubs(params: RequestParams) {
  return api.get('/hubs', { params }).then((res) => res.data);
}

export async function getHubById(id: string) {
  return api.get(`/hubs/${id}`).then((res) => res.data);
}

export async function getAllPitches(params: RequestParams) {
  return api.get('/pitches', { params }).then((res) => res.data);
}
