import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export const modulate =
  (options?: {
    brightness?: number | undefined;
    saturation?: number | undefined;
    hue?: number | undefined;
    lightness?: number | undefined;
  }): Processor =>
  (input: Buffer) =>
    sharp(input).modulate(options);
