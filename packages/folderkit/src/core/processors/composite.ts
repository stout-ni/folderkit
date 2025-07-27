import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const composite =
  (...options: sharp.OverlayOptions[]): Processor =>
  (input: Buffer) =>
    sharp(input).composite(options);
