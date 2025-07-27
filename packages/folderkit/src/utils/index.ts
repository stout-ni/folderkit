import path from 'node:path';
import { RESOURCE_DIR } from '@folderkit/constants';
import type { Options } from '@folderkit/types';
import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

export const getFolderResourcePath = ({
  theme,
  resolution,
}: Pick<Options, 'theme' | 'resolution'>): string =>
  path.join(RESOURCE_DIR, `folders/${theme}.iconset`, `icon_${resolution}.png`);

export const pipeProcessors = async (
  input: sharp.SharpInput,
  ...processors: (Processor | undefined)[]
) => {
  const validProcessors = processors.filter(
    (p): p is Processor => p !== undefined,
  );

  return validProcessors.reduce<Promise<Buffer>>(
    async (previousPromise, processor) => {
      const processedImage = await processor(await previousPromise);
      return processedImage.toFormat('png').toBuffer();
    },
    sharp(input).toBuffer(),
  );
};

export const withErrorBoundary = <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return fn();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
