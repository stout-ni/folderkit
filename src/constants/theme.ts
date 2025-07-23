import type { Color } from 'sharp';
import { FolderTheme } from '@/types';

export const TOP_BEZEL_COLOR: Color = { r: 58, g: 152, b: 208, alpha: 1 };
export const BOTTOM_BEZEL_COLOR: Color = { r: 174, g: 225, b: 253, alpha: 1 };

export const THEME_FILL_COLOR: Record<FolderTheme, Color> = {
  [FolderTheme.Tahoe]: { r: 74, g: 141, b: 172 },
  [FolderTheme.BigSurLight]: { r: 8, g: 134, b: 206 },
  [FolderTheme.BigSurDark]: { r: 6, g: 111, b: 194 },
};
