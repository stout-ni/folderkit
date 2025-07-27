import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const modulate =
  (options?: {
    brightness?: number | undefined;
    saturation?: number | undefined;
    hue?: number | undefined;
    lightness?: number | undefined;
  }): Processor =>
  (input: Buffer) =>
    sharp(input).modulate(options);
