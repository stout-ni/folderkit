import type { Options } from '@folderkit/types';
import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

export const getFolderResource = async ({
  theme,
  resolution,
}: Pick<Options, 'theme' | 'resolution'>) => {
  const { default: resource } = await import(
    `@folderkit/resources/folders/${theme}.iconset/icon_${resolution}.ts`
  );

  return Buffer.from(resource, 'base64');
};

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
