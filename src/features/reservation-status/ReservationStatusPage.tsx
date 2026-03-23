import { css } from '@emotion/react';
import {  useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ReservationWithRoomName } from 'shared/api/remotes';
import { formatDate, timeToMinutes } from 'shared/utils/date';
import { EQUIPMENT_LABELS, HOUR_LABELS, TOTAL_MINUTES } from 'shared/constants/room-booking';
import { reservationQueries } from 'shared/api/query-factory/reservation';
import { roomQueries } from 'shared/api/query-factory/room';
import MyReservationList from './components/MyReservationList';

export default function ReservationStatusPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(formatDate(new Date()));

  const { data: rooms = [] } = useQuery({ ...roomQueries.list() });
  const { data: reservations = [] } = useQuery({ ...reservationQueries.list(date) });
  const { data: myReservationList = [] } = useQuery({ ...reservationQueries.myList() });

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const myReservationsWithRoomName: ReservationWithRoomName[] = useMemo(
    () =>
      myReservationList.map(reservation => ({
        ...reservation,
        roomName: rooms.find(room => room.id === reservation.roomId)?.name ?? reservation.roomId,
      })),
    [myReservationList, rooms]
  );
  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
          `}
        >
          <input
            type="date"
            value={date}
            min={formatDate(new Date())}
            onChange={e => setDate(e.target.value)}
            aria-label="날짜"
            css={css`
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 500;
              line-height: 1.5;
              height: 48px;
              background-color: ${colors.grey50};
              border-radius: 12px;
              color: ${colors.grey800};
              width: 100%;
              border: 1px solid ${colors.grey200};
              padding: 0 16px;
              outline: none;
              transition: border-color 0.15s;
              &:focus {
                border-color: ${colors.blue500};
              }
            `}
          />
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>
        <Spacing size={16} />

        <div
          css={css`
            background: ${colors.grey50};
            border-radius: 14px;
            padding: 16px;
          `}
        >
          {/* 시간 헤더 */}
          <div
            css={css`
              display: flex;
              align-items: flex-end;
              margin-bottom: 8px;
            `}
          >
            <div
              css={css`
                width: 80px;
                flex-shrink: 0;
                padding-right: 8px;
              `}
            />
            <div
              css={css`
                flex: 1;
                position: relative;
                height: 18px;
              `}
            >
              {HOUR_LABELS.map(time => {
                const left = (timeToMinutes(time) / TOTAL_MINUTES) * 100;
                return (
                  <Text
                    key={time}
                    typography="t7"
                    fontWeight="regular"
                    color={colors.grey400}
                    css={css`
                      position: absolute;
                      left: ${left}%;
                      transform: translateX(-50%);
                      font-size: 10px;
                      letter-spacing: -0.3px;
                    `}
                  >
                    {time.slice(0, 2)}
                  </Text>
                );
              })}
            </div>
          </div>

          {/* 회의실별 타임라인 */}
          {rooms.map((room, index) => {
            const roomReservations = reservations.filter(reservation => reservation.roomId === room.id);
            return (
              <div
                key={room.id}
                css={css`
                  display: flex;
                  align-items: center;
                  height: 32px;
                  ${index > 0 ? 'margin-top: 4px;' : ''}
                `}
              >
                <div
                  css={css`
                    width: 80px;
                    flex-shrink: 0;
                    padding-right: 8px;
                  `}
                >
                  <Text
                    typography="t7"
                    fontWeight="medium"
                    color={colors.grey700}
                    ellipsisAfterLines={1}
                    css={css`
                      font-size: 12px;
                    `}
                  >
                    {room.name}
                  </Text>
                </div>
                <div
                  css={css`
                    flex: 1;
                    height: 24px;
                    background: ${colors.white};
                    border-radius: 6px;
                    position: relative;
                    overflow: visible;
                  `}
                >
                  {roomReservations.map(reservation => {
                    const left = (timeToMinutes(reservation.start) / TOTAL_MINUTES) * 100;
                    const width =
                      ((timeToMinutes(reservation.end) - timeToMinutes(reservation.start)) / TOTAL_MINUTES) * 100;
                    const isActive = activeReservation === reservation.id;
                    return (
                      <div
                        key={reservation.id}
                        css={css`
                          position: absolute;
                          left: ${left}%;
                          width: ${width}%;
                          height: 100%;
                        `}
                      >
                        <div
                          role="button"
                          aria-label={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
                          onClick={() => setActiveReservation(isActive ? null : reservation.id)}
                          css={css`
                            width: 100%;
                            height: 100%;
                            background: ${colors.blue400};
                            border-radius: 4px;
                            opacity: ${isActive ? 1 : 0.75};
                            cursor: pointer;
                            transition: opacity 0.15s;
                            &:hover {
                              opacity: 1;
                            }
                          `}
                        />
                        {isActive && (
                          <div
                            role="tooltip"
                            css={css`
                              position: absolute;
                              top: 100%;
                              left: 50%;
                              transform: translateX(-50%);
                              margin-top: 6px;
                              background: ${colors.grey900};
                              color: ${colors.white};
                              padding: 8px 12px;
                              border-radius: 8px;
                              font-size: 12px;
                              white-space: nowrap;
                              z-index: 10;
                              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                              line-height: 1.6;
                            `}
                          >
                            <div>
                              {reservation.start} ~ {reservation.end}
                            </div>
                            <div>{reservation.attendees}명</div>
                            {reservation.equipment.length > 0 && (
                              <div>{reservation.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 내 예약 목록 */}
      <MyReservationList myReservations={myReservationsWithRoomName} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
