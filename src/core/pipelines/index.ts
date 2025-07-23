import type sharp from 'sharp';
import {
  BOTTOM_BEZEL_COLOR,
  RESOLUTION_OFFSET_Y,
  RESOLUTION_SIZE,
  THEME_FILL_COLOR,
  TOP_BEZEL_COLOR,
} from '@/constants';
import {
  blur,
  composite,
  extend,
  negate,
  resize,
  tint,
  translucent,
  trim,
} from '@/core/processors';
import type { Options } from '@/types';
import { pipeProcessors } from '@/utils';

const FULL_MASK_WIDTH = 768;
const FULL_MASK_HEIGHT = 384;

export const pipeResizedMask = (
  input: sharp.SharpInput,
  { trim: shouldTrim, resolution }: Options,
) => {
  const resolutionSize = RESOLUTION_SIZE[resolution];
  const resolutionOffsetY = RESOLUTION_OFFSET_Y[resolution];

  const resizedWidth = Math.floor((resolutionSize * 3) / 4);
  const resizedHeight = Math.floor(resolutionSize / 2);

  return pipeProcessors(
    input,
    shouldTrim ? trim() : undefined,
    resize({
      width: FULL_MASK_WIDTH,
      height: FULL_MASK_HEIGHT,
      fit: 'contain',
    }),
    resize({ width: resizedWidth, height: resizedHeight, fit: 'contain' }),
    extend({
      top: (resolutionSize - resizedHeight) / 2 + resolutionOffsetY,
      bottom: (resolutionSize - resizedHeight) / 2 - resolutionOffsetY,
      left: (resolutionSize - resizedWidth) / 2,
      right: (resolutionSize - resizedWidth) / 2,
    }),
  );
};

export const pipeFilledMask = (input: sharp.SharpInput, { theme }: Options) =>
  pipeProcessors(input, tint(THEME_FILL_COLOR[theme]), translucent(0.5));

export const pipeTopBezelMask = (input: sharp.SharpInput, _options: Options) =>
  pipeProcessors(
    input,
    negate(),
    tint(TOP_BEZEL_COLOR),
    blur({ step: 5, distance: 2, angle: 180 }),
    composite({ input: input as Buffer, blend: 'dest-in' }),
    translucent(0.6),
  );

export const pipeBottomBezelMask = (
  input: sharp.SharpInput,
  _options: Options,
) =>
  pipeProcessors(
    input,
    tint(BOTTOM_BEZEL_COLOR),
    blur({ step: 5, distance: 1, angle: 180 }),
    composite({ input: input as Buffer, blend: 'dest-out' }),
    translucent(0.6),
  );
