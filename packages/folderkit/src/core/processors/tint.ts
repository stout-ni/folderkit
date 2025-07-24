import sharp from 'sharp';
import type { Processor } from '@/types/processor';

export type TintStrategy = 'overlay' | 'fill';

export const tint =
  (color: sharp.Color, strategy: TintStrategy = 'fill'): Processor =>
  async (input: Buffer) => {
    if (strategy === 'overlay') {
      return sharp(input).tint(color);
    }

    const { width, height } = await sharp(input).metadata();

    return sharp({
      create: { width, height, channels: 4, background: color },
    }).composite([{ input, blend: 'dest-in' }]);
  };
