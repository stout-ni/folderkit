import path from 'node:path';
import sharp from 'sharp';
import type { Options } from '@/types';
import type { Processor } from '@/types/processor';

export const FOLDER_RESOURCE_DIR = path.resolve('src/resources/folders');
export const BADGE_RESOURCE_DIR = path.resolve('src/resources/badge');

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

export const getFolderResourcePath = ({
  theme,
  resolution,
}: Pick<Options, 'theme' | 'resolution'>): string =>
  path.join(FOLDER_RESOURCE_DIR, `${theme}.iconset`, `icon_${resolution}.png`);

export const withErrorBoundary = <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return fn();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
