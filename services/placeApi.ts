import axios from 'axios';
import { City } from 'types';

export async function getCities() {
  return axios.get<City[]>(`/api/v1/places/cities`).then((res) => res.data);
}
