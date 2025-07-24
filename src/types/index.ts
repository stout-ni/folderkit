import type { FolderTheme, Resolution } from '@/enums';

/**
 * Configuration options for generating folder icons.
 */
export interface Options {
  /**
   * Whether to trim transparent edges from the output image.
   * @defaultValue `false`
   */
  trim?: boolean;
  /**
   * The visual theme to use for the folder icon.
   * @see {@link FolderTheme} for available theme options
   */
  theme: FolderTheme;
  /**
   * The output resolution of the generated icon.
   * @see {@link Resolution} for available resolution options
   */
  resolution: Resolution;
}
