import { Resolution } from '@/types';

const RETINA_SCALE = 2;

export const RESOLUTION_SIZE: Record<Resolution, number> = {
  [Resolution.NonRetina16]: 16,
  [Resolution.Retina16]: 16 * RETINA_SCALE,
  [Resolution.NonRetina32]: 32,
  [Resolution.Retina32]: 32 * RETINA_SCALE,
  [Resolution.NonRetina128]: 128,
  [Resolution.Retina128]: 128 * RETINA_SCALE,
  [Resolution.NonRetina256]: 256,
  [Resolution.Retina256]: 256 * RETINA_SCALE,
  [Resolution.NonRetina512]: 512,
  [Resolution.Retina512]: 512 * RETINA_SCALE,
};

export const RESOLUTION_OFFSET_Y: Record<Resolution, number> = {
  [Resolution.NonRetina16]: 2,
  [Resolution.Retina16]: 2,
  [Resolution.NonRetina32]: 2,
  [Resolution.Retina32]: 3,
  [Resolution.NonRetina128]: 6,
  [Resolution.Retina128]: 12,
  [Resolution.NonRetina256]: 12,
  [Resolution.Retina256]: 24,
  [Resolution.NonRetina512]: 24,
  [Resolution.Retina512]: 48,
};
