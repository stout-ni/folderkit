import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export const negate =
  (options?: boolean | sharp.NegateOptions): Processor =>
  (input: Buffer) =>
    sharp(input).negate(options);
