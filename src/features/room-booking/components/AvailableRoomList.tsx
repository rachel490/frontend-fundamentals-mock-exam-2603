import { css } from '@emotion/react';
import { Button, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Room } from '_tosslib/server/types';
import AvailableRoomItem from './AvailableRoomItem';
import EmptyList from 'shared/components/EmptyList';

/**
 *
 * 예약 가능 회의실 목록
 */

interface AvailableRoomListProps {
  availableRooms: Room[];
  selectedRoomId: null | string;
  onSelect: (roomId: string) => void;
  handleBook: () => void;
  isBooking?: boolean;
}

const AvailableRoomList = ({
  availableRooms,
  selectedRoomId,
  onSelect,
  handleBook,
  isBooking,
}: AvailableRoomListProps) => {
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
              <AvailableRoomItem key={room.id} room={room} onSelect={() => onSelect(room.id)} isSelected={isSelected} />
            );
          })}
        </ul>
      )}

      <Spacing size={16} />
      <Button display="full" onClick={handleBook} disabled={isBooking}>
        {isBooking ? '예약 중' : '확정'}
      </Button>
    </div>
  );
};

export default AvailableRoomList;
