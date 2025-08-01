import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_ICNS_FILENAME, DEFAULT_OPTIONS } from '@folderkit/constants';
import {
  processImage,
  validateIconSetOptions,
  validateOptions,
} from '@folderkit/core';
import { Resolution } from '@folderkit/enums';
import type { IconSetOptions, Options } from '@folderkit/types';
import { bold, withErrorBoundary } from '@folderkit/utils';
import type { SharpInput } from 'sharp';

/**
 * Generates a folder icon in native macOS style from the specified input image.
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
  options: Options = {},
): Promise<Buffer> => {
  const mergedOptions: Options = { ...DEFAULT_OPTIONS, ...options };

  return withErrorBoundary(async () => {
    // Validate options and resources
    validateOptions(mergedOptions);

    // Process the image through the pipeline
    return await processImage(input, mergedOptions);
  });
};

/**
 * Generates a complete icon set (.iconset folder) for macOS from the specified input image.
 *
 * @param input - Input image (Buffer, Uint8Array, or file path) to be used as the folder icon
 * @param output - Output directory path for the generated .iconset (will be created if it does not exist)
 * @param options - Optional icon set generation options including theme and trim
 * @returns Promise that resolves when the icon set has been generated
 *
 * @example
 * // Basic usage with default options
 * await generateIconSet(inputBuffer, 'MyFolder.iconset');
 *
 * @example
 * // Custom theme and options
 * await generateIconSet(inputBuffer, 'Custom.iconset', {
 *   theme: FolderTheme.BigSurDark,
 *   trim: false
 * });
 */
export const generateIconSet = (
  input: SharpInput,
  output: string,
  options: IconSetOptions = {},
) => {
  // Ensure the output directory has the .iconset extension
  if (path.extname(output) !== '.iconset') {
    output += '.iconset';
  }

  const { resolution: _resolution, ...defaultOptions } = DEFAULT_OPTIONS;
  const mergedOptions: IconSetOptions = { ...defaultOptions, ...options };

  return withErrorBoundary(async () => {
    // Validate icon set options and output path
    validateIconSetOptions({ ...mergedOptions, output });

    fs.mkdirSync(output, { recursive: true });

    // Generate PNG icons for each supported resolution and write them to the iconset directory
    await Promise.all(
      Object.values(Resolution).map(async (resolution) =>
        fs.writeFileSync(
          path.join(output, `icon_${resolution}.png`),
          await processImage(input, { ...mergedOptions, resolution }),
        ),
      ),
    );

    // Print instructions for converting the iconset to an .icns file
    const icnsPath = path.join(output, '..', DEFAULT_ICNS_FILENAME);
    console.log(`Iconset generated at: ${output}`);
    console.log(
      'To convert the iconset to an .icns file, run the following command:',
    );
    console.log(
      bold(`\n    iconutil --convert icns ${output} --output ${icnsPath}\n`),
    );
  });
};
