import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const trim =
  (options?: sharp.TrimOptions): Processor =>
  (input: Buffer) =>
    sharp(input).trim(options);
