import { DEFAULT_RESOLUTION, RESOLUTION_SIZE } from '@folderkit/constants';
import { Resolution } from 'folderkit';

export const isValueInEnum = <T extends Record<string, string>>(
  e: T,
  value?: string,
): value is T[keyof T] => (value ? Object.values(e).includes(value) : false);

export const capitalize = (str: string) =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export const getResolutionSize = (resolution: string) => {
  return isValueInEnum(Resolution, resolution)
    ? RESOLUTION_SIZE[resolution]
    : RESOLUTION_SIZE[DEFAULT_RESOLUTION];
};
