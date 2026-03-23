import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import EmptyList from 'shared/components/EmptyList';
import ReservationItem from './MyReservationItem';
import { cancelReservation, Reservation, ReservationWithRoomName } from 'shared/api/remotes';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationQueries } from 'shared/api/query-factory/reservation';

const MyReservationList = ({ myReservations }: { myReservations: ReservationWithRoomName[] }) => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  const cancelMutation = useMutation(cancelReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...reservationQueries.listKey()] });
      queryClient.invalidateQueries({ queryKey: [...reservationQueries.myListKey()] });
    },
  });

  const handleCancel = async (id: Reservation['id']) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  return (
    <>
      {/* 메시지 배너 */}
      {message && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${message.type === 'success' ? colors.blue50 : colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text
              typography="t7"
              fontWeight="medium"
              color={message.type === 'success' ? colors.blue600 : colors.red500}
            >
              {message.text}
            </Text>
          </div>
          <Spacing size={12} />
        </div>
      )}

      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: baseline;
            gap: 6px;
          `}
        >
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>
          {myReservations.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {myReservations.length}건
            </Text>
          )}
        </div>
        <Spacing size={16} />

        {myReservations.length === 0 ? (
          <EmptyList text="예약 내역이 없습니다." />
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 10px;
            `}
          >
            {myReservations.map(reservation => (
              <ReservationItem key={reservation.id} reservation={reservation} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyReservationList;
