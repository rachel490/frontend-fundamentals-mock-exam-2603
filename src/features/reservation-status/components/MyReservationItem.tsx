import { css } from '@emotion/react';
import { Button, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Reservation, ReservationWithRoomName } from 'shared/api/remotes';
import { EQUIPMENT_LABELS } from 'shared/constants/room-booking';

const MyReservationItem = ({
  reservation,
  onCancel,
}: {
  reservation: ReservationWithRoomName;
  onCancel: (id: Reservation['id']) => void;
}) => {
  return (
    <div
      key={reservation.id}
      css={css`
        padding: 14px 16px;
        border-radius: 14px;
        background: ${colors.grey50};
        border: 1px solid ${colors.grey200};
      `}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={reservation.roomName}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${
              reservation.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
            }`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={
          <Button
            type="danger"
            style="weak"
            size="small"
            onClick={e => {
              e.stopPropagation();
              if (window.confirm('정말 취소하시겠습니까?')) {
                onCancel(reservation.id);
              }
            }}
          >
            취소
          </Button>
        }
      />
    </div>
  );
};

export default MyReservationItem;
