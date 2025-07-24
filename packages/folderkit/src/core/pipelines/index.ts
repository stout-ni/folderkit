import type { SharpInput } from 'sharp';
import {
  BOTTOM_BEZEL_COLOR,
  RESOLUTION_OFFSET_Y,
  RESOLUTION_SIZE,
  THEME_FILL_COLOR,
  TOP_BEZEL_COLOR,
} from '@/constants';
import * as processors from '@/core/processors';
import type { Filter, Options } from '@/types';
import { pipeProcessors, withErrorBoundary } from '@/utils';

const FULL_MASK_WIDTH = 768;
const FULL_MASK_HEIGHT = 384;

export const pipeResizedMask = async (
  input: SharpInput,
  { trim: shouldTrim, resolution }: Pick<Options, 'trim' | 'resolution'>,
) => {
  return withErrorBoundary(async () => {
    const resolutionSize = RESOLUTION_SIZE[resolution];
    if (!resolutionSize) {
      throw Error(`Unsupported resolution: ${resolution}`);
    }

    const resizedWidth = Math.floor((resolutionSize * 3) / 4);
    const resizedHeight = Math.floor(resolutionSize / 2);
    const offsetY = RESOLUTION_OFFSET_Y[resolution] || 0;

    const centerOffset = (size: number, resized: number) =>
      (size - resized) / 2;

    try {
      const result = await pipeProcessors(
        input,
        shouldTrim ? processors.trim() : undefined,
        processors.resize({
          width: FULL_MASK_WIDTH,
          height: FULL_MASK_HEIGHT,
          fit: 'contain',
        }),
        processors.resize({
          width: resizedWidth,
          height: resizedHeight,
          fit: 'contain',
        }),
        processors.extend({
          top: centerOffset(resolutionSize, resizedHeight) + offsetY,
          bottom: centerOffset(resolutionSize, resizedHeight) - offsetY,
          left: centerOffset(resolutionSize, resizedWidth),
          right: centerOffset(resolutionSize, resizedWidth),
        }),
      );
      return result;
    } catch (error) {
      throw Error(
        `Failed to resize mask: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });
};

export const pipeFilledMask = (
  input: SharpInput,
  { theme }: Pick<Options, 'theme'>,
) =>
  withErrorBoundary(async () => {
    const fillColor = THEME_FILL_COLOR[theme];
    if (!fillColor) {
      throw Error(`Unsupported theme: ${theme}`);
    }

    try {
      const result = await pipeProcessors(
        input,
        processors.tint(fillColor),
        processors.translucent(0.5),
      );
      return result;
    } catch (error) {
      throw Error(
        `Failed to create filled mask: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

export const pipeTopBezelMask = (input: SharpInput) =>
  withErrorBoundary(async () => {
    try {
      const result = await pipeProcessors(
        input,
        processors.negate(),
        processors.tint(TOP_BEZEL_COLOR),
        processors.blur({ step: 5, distance: 2, angle: 180 }),
        processors.composite({ input: input as Buffer, blend: 'dest-in' }),
        processors.translucent(0.5),
      );
      return result;
    } catch (error) {
      throw Error(
        `Failed to create top bezel mask: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

export const pipeBottomBezelMask = (input: SharpInput) =>
  withErrorBoundary(async () => {
    try {
      const result = await pipeProcessors(
        input,
        processors.tint(BOTTOM_BEZEL_COLOR),
        processors.blur({ step: 5, distance: 1, angle: 180 }),
        processors.composite({ input: input as Buffer, blend: 'dest-out' }),
        processors.translucent(0.6),
      );

      return result;
    } catch (error) {
      throw Error(
        `Failed to create bottom bezel mask: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

export const pipeFilter = (input: SharpInput, filterOptions: Partial<Filter>) =>
  withErrorBoundary(async () => {
    const tintFilterProcessors = filterOptions.tintColor
      ? [
          processors.modulate({ saturation: 0.1 }),
          processors.tint(filterOptions.tintColor, 'overlay'),
        ]
      : [];

    return await pipeProcessors(input, ...tintFilterProcessors);
  });
