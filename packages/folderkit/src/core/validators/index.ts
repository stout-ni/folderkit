import fs from 'node:fs';
import { FolderTheme, Resolution } from '@/enums';
import type { IconSetOptions, Options } from '@/types';

export const validateOptions = (options: Options) => {
  if (!Object.values(Resolution).includes(options.resolution)) {
    throw Error(`Unsupported resolution: ${options.resolution}`);
  }

  if (!Object.values(FolderTheme).includes(options.theme)) {
    throw Error(`Unsupported theme: ${options.theme}`);
  }
};

export const validateIconSetOptions = (
  options: IconSetOptions & { output: string },
) => {
  if (fs.existsSync(options.output)) {
    throw Error(`Path already exists: ${options.output}`);
  }

  if (!Object.values(FolderTheme).includes(options.theme)) {
    throw Error(`Unsupported theme: ${options.theme}`);
  }
};
