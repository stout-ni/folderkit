import fs from 'node:fs';
import { FolderTheme, Resolution } from '@/enums';
import type { IconSetOptions, Options } from '@/types';

export const validateOptions = ({ resolution, theme }: Options) => {
  if (!resolution || !Object.values(Resolution).includes(resolution)) {
    throw Error(`Unsupported resolution: ${resolution}`);
  }

  if (!theme || !Object.values(FolderTheme).includes(theme)) {
    throw Error(`Unsupported theme: ${theme}`);
  }
};

export const validateIconSetOptions = ({
  theme,
  output,
}: IconSetOptions & { output: string }) => {
  if (fs.existsSync(output)) {
    throw Error(`Path already exists: ${output}`);
  }

  if (!theme || !Object.values(FolderTheme).includes(theme)) {
    throw Error(`Unsupported theme: ${theme}`);
  }
};
