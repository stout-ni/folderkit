import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const negate =
  (options?: boolean | sharp.NegateOptions): Processor =>
  (input: Buffer) =>
    sharp(input).negate(options);
