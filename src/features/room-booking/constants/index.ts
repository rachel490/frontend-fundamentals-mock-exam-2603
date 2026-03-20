import { Equipment } from '_tosslib/server/types';
import { objectKeys } from 'utils/type';

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
} as const;

export const ALL_EQUIPMENT = objectKeys(EQUIPMENT_LABELS);
