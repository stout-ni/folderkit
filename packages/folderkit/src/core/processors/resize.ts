import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export const resize =
  (options: sharp.ResizeOptions): Processor =>
  (input: Buffer) =>
    sharp(input).resize({
      ...options,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
