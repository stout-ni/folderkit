import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const translucent =
  (alpha: number): Processor =>
  (input: Buffer) =>
    sharp(input)
      .ensureAlpha()
      .composite([
        {
          input: {
            create: {
              width: 1,
              height: 1,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha },
            },
          },
          blend: 'dest-in',
          tile: true,
        },
      ]);
