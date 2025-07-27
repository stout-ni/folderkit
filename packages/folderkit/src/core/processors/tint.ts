import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

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
