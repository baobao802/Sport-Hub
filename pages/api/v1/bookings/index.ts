import type { NextApiRequest, NextApiResponse } from 'next';
import { io } from 'socket.io-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const socket = io(
      'wss://sport-hub-apis.eastasia.cloudapp.azure.com/booking',
      {
        transports: ['websocket'],
        withCredentials: true,
        rejectUnauthorized: false,
        extraHeaders: {
          cookie: req.headers.cookie as string,
        },
      },
    );
    socket.on('connect', () => {
      socket.emit('create-new-booking', req.body);
    });
    res.end();
  }
}
