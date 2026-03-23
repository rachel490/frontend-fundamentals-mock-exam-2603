import type { Equipment as _Equipment, Room as _Room, Reservation as _Reservation } from '_tosslib/server/types';
import { http } from 'shared/api/http';

export type Equipment = _Equipment;
export type Room = _Room;
export type Reservation = _Reservation;
export type ReservationWithRoomName = Reservation & { roomName: Room['name'] };

export function getRooms() {
  return http.get<Room[]>('/api/rooms');
}

export function getReservations(date: Reservation['date']) {
  return http.get<Reservation[]>(`/api/reservations?date=${date}`);
}

export function createReservation(data: Omit<Reservation, 'id'>) {
  return http.post<typeof data, { ok: boolean; reservation?: unknown; code?: string; message?: string }>(
    '/api/reservations',
    data
  );
}

export function getMyReservations() {
  return http.get<Reservation[]>('/api/my-reservations');
}

export function cancelReservation(id: Reservation['id']) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}
