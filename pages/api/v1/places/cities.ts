import api from '@services/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data } = await api.get('/places/cities', {
    headers: {
      cookie: req.headers.cookie as any,
    },
  });
  res.status(200).json(data);
}
