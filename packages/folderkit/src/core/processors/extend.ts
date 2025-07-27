import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const extend =
  (options: sharp.ExtendOptions): Processor =>
  (input: Buffer) =>
    sharp(input).extend({
      ...options,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
