import type sharp from 'sharp';
import {
  pipeBottomBezelMask,
  pipeFilledMask,
  pipeResizedMask,
  pipeTopBezelMask,
} from '@/core/pipelines';
import { composite } from '@/core/processors';
import { FolderTheme, type Options, Resolution } from '@/types';
import { getFolderResourcePath, pipeProcessors } from '@/utils';

const DEFAULT_OPTIONS: Options = {
  theme: FolderTheme.BigSurLight,
  resolution: Resolution.NonRetina256,
};

export const generate = async (
  input: sharp.SharpInput,
  options: Options = DEFAULT_OPTIONS,
) => {
  const resizedMask = await pipeResizedMask(input, options);

  const filledMask = await pipeFilledMask(resizedMask, options);
  const topBezelMask = await pipeTopBezelMask(resizedMask, options);
  const bottomBezelMask = await pipeBottomBezelMask(resizedMask, options);

  return pipeProcessors(
    getFolderResourcePath(options),
    composite(
      { input: filledMask },
      { input: topBezelMask },
      { input: bottomBezelMask },
    ),
  );
};
