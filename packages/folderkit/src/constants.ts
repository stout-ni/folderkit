import path from 'node:path';
import url from 'node:url';
import type { Color } from 'sharp';
import { FolderTheme, Resolution } from '@/enums';

export const RESOURCE_DIR = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  'resources',
);

const RETINA_SCALE = 2;

export const RESOLUTION_SIZE: Record<Resolution, number> = {
  [Resolution.NonRetina16]: 16,
  [Resolution.Retina16]: 16 * RETINA_SCALE,
  [Resolution.NonRetina32]: 32,
  [Resolution.Retina32]: 32 * RETINA_SCALE,
  [Resolution.NonRetina128]: 128,
  [Resolution.Retina128]: 128 * RETINA_SCALE,
  [Resolution.NonRetina256]: 256,
  [Resolution.Retina256]: 256 * RETINA_SCALE,
  [Resolution.NonRetina512]: 512,
  [Resolution.Retina512]: 512 * RETINA_SCALE,
};

export const RESOLUTION_OFFSET_Y: Record<Resolution, number> = {
  [Resolution.NonRetina16]: 2,
  [Resolution.Retina16]: 2,
  [Resolution.NonRetina32]: 2,
  [Resolution.Retina32]: 3,
  [Resolution.NonRetina128]: 6,
  [Resolution.Retina128]: 12,
  [Resolution.NonRetina256]: 12,
  [Resolution.Retina256]: 24,
  [Resolution.NonRetina512]: 24,
  [Resolution.Retina512]: 48,
};

export const TOP_BEZEL_COLOR: Color = { r: 58, g: 152, b: 208, alpha: 1 };
export const BOTTOM_BEZEL_COLOR: Color = { r: 174, g: 225, b: 253, alpha: 1 };

export const THEME_FILL_COLOR: Record<FolderTheme, Color> = {
  [FolderTheme.Tahoe]: { r: 74, g: 141, b: 172 },
  [FolderTheme.BigSurLight]: { r: 8, g: 134, b: 206 },
  [FolderTheme.BigSurDark]: { r: 6, g: 111, b: 194 },
};

export const DEFAULT_ICNS_FILENAME = 'GenericFolderIcon.icns';
