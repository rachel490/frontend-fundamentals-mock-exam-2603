import { css } from '@emotion/react';
import { Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import AvailableRoomItem from './AvailableRoomItem';
import EmptyList from 'shared/components/EmptyList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatDate } from 'shared/utils/date';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roomQueries } from 'shared/api/query-factory/room';
import { createReservation, Equipment } from 'shared/api/remotes';
import { reservationQueries } from 'shared/api/query-factory/reservation';
import axios from 'axios';

/**
 *
 * 예약 가능 회의실 목록
 */

const AvailableRoomList = ({
  setErrorMessage,
  selectedRoomId,
  setSelectedRoomId,
}: {
  setErrorMessage: (message: string) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const date = searchParams.get('date') || formatDate(new Date());
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';
  const attendees = Number(searchParams.get('attendees')) || 1;
  const equipment = searchParams.get('equipment')
    ? (searchParams.get('equipment')!.split(',').filter(Boolean) as Equipment[])
    : [];
  const preferredFloor = searchParams.get('floor') ? Number(searchParams.get('floor')) : null;

  const { data: rooms = [] } = useQuery({ ...roomQueries.list() });
  const { data: reservations = [] } = useQuery({ ...reservationQueries.list(date) });

  const createMutation = useMutation(createReservation, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...reservationQueries.listKey(), variables.date] });
      queryClient.invalidateQueries({ queryKey: [...reservationQueries.myListKey()] });
    },
  });

  // 입력 검증
  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  const availableRooms = isFilterComplete
    ? rooms
        .filter(room => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;
          const hasConflict = reservations.some(
            reservation =>
              reservation.roomId === room.id &&
              reservation.date === date &&
              reservation.start < endTime &&
              reservation.end > startTime
          );
          if (hasConflict) return false;
          return true;
        })
        .sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      {/* 헤더  */}
      <div
        css={css`
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      </div>

      <Spacing size={16} />

      {/* 리스트 */}
      {availableRooms.length === 0 ? (
        <EmptyList text="조건에 맞는 회의실이 없습니다." />
      ) : (
        <ul
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {availableRooms.map(room => {
            const isSelected = selectedRoomId === room.id;

            return (
              <AvailableRoomItem
                key={room.id}
                room={room}
                onSelect={() => setSelectedRoomId(room.id)}
                isSelected={isSelected}
              />
            );
          })}
        </ul>
      )}

      <Spacing size={16} />
      <Button display="full" onClick={handleBook} disabled={createMutation.isPending}>
        {createMutation.isPending ? '예약 중' : '확정'}
      </Button>
    </div>
  );
};

export default AvailableRoomList;
