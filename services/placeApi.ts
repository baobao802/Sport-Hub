import api from './api';

export async function getCities() {
  return api.get(`/places/cities`).then((res) => res.data);
}
