import api from './api';

export async function getIPGeo() {
  return api.get(
    `${process.env.NEXT_PUBLIC_GEOAPIFY_URL}/ipinfo?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
    {
      withCredentials: false,
    },
  );
}

export async function getGeocoding({ lat, lon }: { lat: number; lon: number }) {
  return api.get(
    `${process.env.NEXT_PUBLIC_GEOAPIFY_URL}/geocode/reverse?lat=${lat}&lon=${lon}&type=city&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`,
    {
      withCredentials: false,
    },
  );
}
