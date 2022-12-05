import api from '@services/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PATCH') {
    console.log(req.query);
    const { data } = await api.patch(
      `/bookings/${req.query.bookingId}/cancel`,
      {},
      {
        headers: {
          cookie: req.headers.cookie as any,
        },
      },
    );
    res.status(200).json(data);
  }
}
