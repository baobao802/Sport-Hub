import api from '@services/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data } = await api.get('/bookings/my-history', {
    headers: {
      cookie: req.headers.cookie as any,
    },
    params: req.query,
  });
  res.status(200).json(data);
}
