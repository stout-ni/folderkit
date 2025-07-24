import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export const composite =
  (...options: sharp.OverlayOptions[]): Processor =>
  (input: Buffer) =>
    sharp(input).composite(options);
