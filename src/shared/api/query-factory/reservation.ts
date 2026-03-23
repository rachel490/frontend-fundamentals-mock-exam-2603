import { queryOptions } from '@tanstack/react-query';
import { getMyReservations, getReservations, getRooms, Reservation } from '../remotes';

export const reservationQueries = {
  listKey: () => ['reservations'] as const,
  list: (date: Reservation['date']) =>
    queryOptions({
      queryKey: [...reservationQueries.listKey(), date],
      queryFn: () => getReservations(date),
      enabled: !!date,
    }),

  myListKey: () => ['myReservations'] as const,
  myList: () =>
    queryOptions({
      queryKey: [...reservationQueries.myListKey()],
      queryFn: getMyReservations,
    }),
};
