import { css } from '@emotion/react';
import { Slot } from '@radix-ui/react-slot';
import { ListRow, Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Room } from '_tosslib/server/types';
import React, { useState } from 'react';
import { EQUIPMENT_LABELS } from '../constants';
import AvailableRoomItem from './AvailableRoomItem';

/**
 *
 * 예약 가능 회의실 목록
 */

interface AvailableRoomListProps {
  availableRooms: Room[];
}

const AvailableRoomList = ({ availableRooms }: AvailableRoomListProps) => {
  const [selectedId, setSelectedId] = useState<Room['id'] | null>(null);

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
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text>조건에 맞는 회의실이 없습니다.</Text>
        </div>
      ) : (
        <ul
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {availableRooms.map(room => {
            const isSelected = selectedId === room.id;

            return (
              <AvailableRoomItem
                key={room.id}
                room={room}
                onSelect={() => setSelectedId(room.id)}
                isSelected={isSelected}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AvailableRoomList;
