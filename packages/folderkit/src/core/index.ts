import {
  pipeBottomBezelMask,
  pipeFilledMask,
  pipeFilter,
  pipeResizedMask,
  pipeTopBezelMask,
} from '@folderkit/core/pipelines';
import { composite } from '@folderkit/core/processors';
import type { Options } from '@folderkit/types';
import { getFolderResourcePath, pipeProcessors } from '@folderkit/utils';
import type { SharpInput } from 'sharp';

export const processImage = async (
  input: SharpInput,
  options: Options,
): Promise<Buffer> => {
  // Step 1: Resize the input mask
  const resizedMask = await pipeResizedMask(input, options);

  // Step 2: Process masks in parallel
  const [filledMask, topBezelMask, bottomBezelMask] = await Promise.all([
    // Applies theme color and opacity to create a filled mask
    pipeFilledMask(resizedMask, options),
    // Creates a top bezel effect with blur and tint
    pipeTopBezelMask(resizedMask),
    // Creates a bottom bezel effect with blur and tint
    pipeBottomBezelMask(resizedMask),
  ]);

  // Step 3: Composite the final image
  const resourcePath = getFolderResourcePath(options);

  try {
    const result = await pipeProcessors(
      resourcePath,
      composite(
        { input: filledMask },
        { input: topBezelMask },
        { input: bottomBezelMask },
      ),
    );

    // Step 4: Apply filter to the final image
    return pipeFilter(result, options.filter);
  } catch (error) {
    throw Error(
      `Failed to composite final image: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export * from './validators';
