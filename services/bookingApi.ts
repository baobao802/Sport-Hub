import axios from 'axios';
import _ from 'lodash';
import {
  Booking,
  BookingPayload,
  BookingStatus,
  RequestBookingParams,
} from 'types';
import api from './api';

export async function createBooking(payload: BookingPayload) {
  return (await axios.post('/api/v1/bookings', payload)).data;
}

export async function getBookingHistory(params: RequestBookingParams) {
  return api.get('/bookings/history', { params }).then((res) => res.data);
}

export async function getMyBookingHistory(params: RequestBookingParams) {
  return axios
    .get('/api/v1/bookings/my-history', { params: { size: 24, ...params } })
    .then((res) =>
      _.map(res.data.items, (booking) => ({
        ...booking,
        cost: { value: booking.cost, time: booking.time },
      })),
    );
}

export async function getSuccessBooking(params: RequestBookingParams) {
  return api
    .get('/bookings/history', {
      params: { size: 24, status: BookingStatus.DONE, ...params },
    })
    .then((res) =>
      _.map(res.data.items, (booking) => ({
        ...booking,
        cost: { value: booking.cost, time: booking.time },
      })),
    );
}

export async function cancelBooking(bookingId: number) {
  return axios.patch(`/api/v1/bookings/${bookingId}`);
}
