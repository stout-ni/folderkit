import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export const trim =
  (options?: sharp.TrimOptions): Processor =>
  (input: Buffer) =>
    sharp(input).trim(options);
