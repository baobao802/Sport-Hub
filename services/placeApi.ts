import { City } from 'types';
import api from './api';

export async function getCities() {
  return api.get<City[]>(`/places/cities`).then((res) => res.data);
}
