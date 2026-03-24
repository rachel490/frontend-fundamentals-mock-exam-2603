import { css } from '@emotion/react';
import { Select, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import Field from './Field';
import { formatDate } from 'shared/utils/date';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS, TIME_SLOTS } from 'shared/constants/room-booking';
import { rooms } from '_tosslib/server/data/rooms';
import useBookingFilter from '../hooks/useBookingFilter';

const BookingFilter = ({
  errorMessage,
  setErrorMessage,
  setSelectedRoomId,
}: {
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  setSelectedRoomId: (id: string | null) => void;
}) => {
  const { date, startTime, endTime, attendees, preferredFloor, equipment, validationError, updateFilter } =
    useBookingFilter();
  const floors = [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedRoomId(null);
    setErrorMessage(null);
    updateFilter({ key, value });
  };

  return (
    <>
      {/* 에러메시지 섹션  */}
      {errorMessage && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {errorMessage}
            </Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      {/* 예약 조건 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />

        {/* 날짜 */}
        <Field label="날짜">
          <input
            type="date"
            aria-label="날짜"
            value={date}
            min={formatDate(new Date())}
            onChange={e => handleFilterChange('date', e.target.value)}
            css={css`
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 500;
              line-height: 48px;
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
        </Field>
        <Spacing size={14} />

        {/* 시간 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          {/* 시작 시간 */}
          <Field label="시작 시간" containerProps={{ style: { flex: 1 } }}>
            <Select
              value={startTime}
              aria-label="시작 시간"
              onChange={e => handleFilterChange('startTime', e.target.value)}
            >
              <option value="">선택</option>
              {TIME_SLOTS.slice(0, -1).map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </Field>

          {/* 종료 시간 */}
          <Field label="종료 시간" containerProps={{ style: { flex: 1 } }}>
            <Select
              value={endTime}
              aria-label="종료 시간"
              onChange={e => handleFilterChange('endTime', e.target.value)}
            >
              <option value="">선택</option>
              {TIME_SLOTS.slice(1).map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <Field label="참석 인원" containerProps={{ style: { flex: 1 } }}>
            <input
              type="number"
              min={1}
              value={attendees}
              onChange={e => handleFilterChange('attendees', String(Math.max(1, Number(e.target.value))))}
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
          </Field>

          <Field label="선호 층" containerProps={{ style: { flex: 1 } }}>
            <Select
              aria-label="선호 층"
              value={preferredFloor ?? ''}
              onChange={e => handleFilterChange('floor', e.target.value)}
            >
              <option value="">전체</option>
              {floors.map(floor => (
                <option key={floor}>{floor}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <Field label="필요 장비" containerProps={{ style: { gap: '8px' } }}>
          <div
            css={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            `}
          >
            {ALL_EQUIPMENT.map(eq => {
              const isSelected = equipment.includes(eq);
              const label = EQUIPMENT_LABELS[eq];

              return (
                <button
                  key={eq}
                  type="button"
                  aria-label={label}
                  aria-pressed={isSelected}
                  onClick={() => {
                    const updated = isSelected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                    handleFilterChange('equipment', updated.join(','));
                  }}
                  css={css`
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid ${isSelected ? colors.blue500 : colors.grey200};
                    background: ${isSelected ? colors.blue50 : colors.grey50};
                    color: ${isSelected ? colors.blue600 : colors.grey700};
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                    &:hover {
                      border-color: ${isSelected ? colors.blue500 : colors.grey400};
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {/* 에러 메시지 */}
      {validationError && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={8} />
          <span
            css={css`
              color: ${colors.red500};
              font-size: 14px;
            `}
          >
            {validationError}
          </span>
        </div>
      )}
    </>
  );
};

export default BookingFilter;
