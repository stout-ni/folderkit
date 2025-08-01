import type { FolderTheme, Resolution } from '@folderkit/enums';
import type { Color } from 'sharp';

/**
 * Configuration options for generating a complete icon set (.iconset folder) for macOS.
 * This type omits the 'resolution' property from {@link Options} since all required resolutions are generated.
 * @see {@link Options} for the base configuration options
 */
export type IconSetOptions = Omit<Options, 'resolution'>;

/**
 * Configuration options for generating folder icons.
 */
export interface Options {
  /**
   * Whether to trim transparent edges from the output image.
   * @defaultValue `true`
   */
  trim?: boolean;
  /**
   * The visual theme to use for the folder icon.
   * @see {@link FolderTheme} for available theme options
   */
  theme?: FolderTheme;
  /**
   * The filter to apply to the generated icon.
   */
  filter?: Filter;
  /**
   * The output resolution of the generated icon.
   * @see {@link Resolution} for available resolution options
   */
  resolution?: Resolution;
}

/**
 * Configuration options for applying filters to the generated icon.
 */
export interface Filter {
  /**
   * The color to use for a tint filter on top of the generated icon.
   * This allows customizing the overall color theme of the icon.
   * @defaultValue `undefined`
   */
  tintColor?: Color;
}
