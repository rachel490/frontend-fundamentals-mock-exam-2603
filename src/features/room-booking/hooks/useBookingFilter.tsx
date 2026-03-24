import { useSearchParams } from 'react-router-dom';
import { Equipment } from 'shared/api/remotes';
import { formatDate } from 'shared/utils/date';

const useBookingFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const date = searchParams.get('date') || formatDate(new Date());
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';
  const attendees = Number(searchParams.get('attendees')) || 1;
  const equipment = searchParams.get('equipment')
    ? (searchParams.get('equipment')!.split(',').filter(Boolean) as Equipment[])
    : [];
  const preferredFloor = searchParams.get('floor') ? Number(searchParams.get('floor')) : null;

  const updateFilter = ({ key, value }: { key: string; value: string }) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    else if (attendees < 1) validationError = '참석 인원은 1명 이상이어야 합니다.';
  }

  const isFilterComplete = hasTimeInputs && !validationError;

  return {
    date,
    startTime,
    endTime,
    attendees,
    equipment,
    preferredFloor,
    updateFilter,
    isFilterComplete,
    validationError,
  };
};

export default useBookingFilter;
