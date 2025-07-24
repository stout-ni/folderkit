import type { SharpInput } from 'sharp';
import {
  pipeBottomBezelMask,
  pipeFilledMask,
  pipeResizedMask,
  pipeTopBezelMask,
} from '@/core/pipelines';
import { composite } from '@/core/processors';
import { FolderTheme, Resolution } from '@/enums';
import type { Options } from '@/types';
import {
  getFolderResourcePath,
  pipeProcessors,
  withErrorBoundary,
} from '@/utils';

const DEFAULT_OPTIONS: Readonly<Options> = Object.freeze({
  trim: true,
  theme: FolderTheme.BigSurLight,
  resolution: Resolution.NonRetina256,
});

/**
 * Generates a folder icon with the specified options.
 *
 * @param input - Input image (Buffer, Uint8Array, or file path) to be used as the folder icon
 * @param options - Generation options including theme and resolution
 * @returns Promise that resolves to the generated icon as a PNG Buffer
 *
 * @example
 * // Basic usage with default options (BigSurLight theme, 256x256 non-retina)
 * const icon = await generate(inputBuffer);
 *
 * @example
 * // Custom theme and resolution
 * const icon = await generate(inputBuffer, {
 *   theme: FolderTheme.BigSurDark,
 *   resolution: Resolution.Retina512,
 *   trim: false
 * });
 *
 * @example
 * // Using with file system
 * import { promises as fs } from 'fs';
 *
 * async function createIcon() {
 *   const input = await fs.readFile('input.png');
 *   const icon = await generate(input, {
 *     theme: FolderTheme.Tahoe,
 *     resolution: Resolution.NonRetina128
 *   });
 *   await fs.writeFile('folder-icon.png', icon);
 * }
 */
export const generate = (
  input: SharpInput,
  passedOptions: Partial<Options> = {},
): Promise<Buffer> => {
  const options: Options = { ...DEFAULT_OPTIONS, ...passedOptions };

  return withErrorBoundary(async () => {
    // Validate options and resources
    await validateOptions(options);

    // Process the image through the pipeline
    return await processImage(input, options);
  });
};

const validateOptions = async (options: Options) => {
  if (!Object.values(Resolution).includes(options.resolution)) {
    throw Error(`Unsupported resolution: ${options.resolution}`);
  }

  if (!Object.values(FolderTheme).includes(options.theme)) {
    throw Error(`Unsupported theme: ${options.theme}`);
  }
};

const processImage = async (
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

    return result;
  } catch (error) {
    throw Error(
      `Failed to composite final image: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
