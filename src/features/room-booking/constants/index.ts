import { Equipment } from '_tosslib/server/types';
import { objectKeys } from 'utils/type';

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
} as const;

export const ALL_EQUIPMENT = objectKeys(EQUIPMENT_LABELS);

const START_HOUR = 9;
const END_HOUR = 20;

export const TIME_SLOTS: string[] = [];
for (let h = START_HOUR; h <= END_HOUR; h++) {
  const hour = String(h).padStart(2, '0');

  TIME_SLOTS.push(`${hour}:00`);
  if (h < END_HOUR) TIME_SLOTS.push(`${hour}:30`);
}
