import { Equipment } from '_tosslib/server/types';
import { objectKeys } from 'shared/utils/type';

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
} as const;

export const ALL_EQUIPMENT = objectKeys(EQUIPMENT_LABELS);

export const TIMELINE_START = 9;
export const TIMELINE_END = 20;

export const TIME_SLOTS: string[] = [];
for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
  const hour = String(h).padStart(2, '0');

  TIME_SLOTS.push(`${hour}:00`);
  if (h < TIMELINE_END) TIME_SLOTS.push(`${hour}:30`);
}

export const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));

export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;
