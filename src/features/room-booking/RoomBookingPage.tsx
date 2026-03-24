import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import AvailableRoomList from './components/AvailableRoomList';
import BookingFilter from './components/BookingFilter';

export default function RoomBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';
  const attendees = Number(searchParams.get('attendees')) || 1;

  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    else if (attendees < 1) validationError = '참석 인원은 1명 이상이어야 합니다.';
  }

  const isFilterComplete = hasTimeInputs && !validationError;

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      <BookingFilter
        errorMessage={errorMessage}
        setErrorMessage={text => setErrorMessage(text)}
        setSelectedRoomId={setSelectedRoomId}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <AvailableRoomList
          setErrorMessage={text => setErrorMessage(text)}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
