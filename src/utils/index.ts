import path from 'node:path';
import sharp from 'sharp';
import type { FolderTheme, Resolution } from '@/types';
import type { Processor } from '@/types/processor';

export const FOLDER_RESOURCE_DIR = path.resolve('src/resources/folders');
export const BADGE_RESOURCE_DIR = path.resolve('src/resources/badge');

export const pipeProcessors = (
  input: sharp.SharpInput,
  ...processors: (Processor | undefined)[]
) =>
  processors.reduce(async (previousValue, processor) => {
    if (!processor) return previousValue;

    const processed = await processor(await previousValue);
    return processed.png().toBuffer();
  }, sharp(input).toBuffer());

export const getFolderResourcePath = ({
  theme,
  resolution,
}: {
  theme: FolderTheme;
  resolution: Resolution;
}): string =>
  path.join(FOLDER_RESOURCE_DIR, `${theme}.iconset`, `icon_${resolution}.png`);
