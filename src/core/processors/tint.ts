import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export const tint =
  (color: sharp.Color): Processor =>
  async (input: Buffer) => {
    const { width, height } = await sharp(input).metadata();

    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: color,
      },
    }).composite([
      {
        input,
        blend: 'dest-in',
      },
    ]);
  };
