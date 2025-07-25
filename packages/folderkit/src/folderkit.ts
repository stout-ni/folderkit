import fs from 'node:fs';
import path from 'node:path';
import type { SharpInput } from 'sharp';
import { DEFAULT_ICNS_FILENAME } from '@/constants';
import { processImage, validateIconSetOptions, validateOptions } from '@/core';
import { FolderTheme, Resolution } from '@/enums';
import type { IconSetOptions, Options } from '@/types';
import { bold, withErrorBoundary } from '@/utils';

const DEFAULT_OPTIONS: Readonly<Options> = Object.freeze({
  theme: FolderTheme.BigSurLight,
  filter: {},
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
    validateOptions(options);

    // Process the image through the pipeline
    return await processImage(input, options);
  });
};

export const generateIconSet = (
  input: SharpInput,
  output: string,
  passedOptions: Partial<IconSetOptions> = {},
) => {
  if (path.extname(output) !== '.iconset') {
    output += '.iconset';
  }

  const { resolution: _resolution, ...defaultOptions } = DEFAULT_OPTIONS;
  const options: IconSetOptions = { ...defaultOptions, ...passedOptions };

  return withErrorBoundary(async () => {
    validateIconSetOptions({ ...options, output });

    fs.mkdirSync(output, { recursive: true });

    await Promise.all(
      Object.values(Resolution).map(async (resolution) =>
        fs.writeFileSync(
          path.join(output, `icon_${resolution}.png`),
          await generate(input, { ...options, resolution }),
        ),
      ),
    );

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
