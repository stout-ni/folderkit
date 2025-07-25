/**
 * Supported icon resolutions with retina and non-retina variants.
 *
 * @remark
 * Each variant is available in both standard and \@2x (retina) resolutions.
 * The naming follows the pattern: `{width}x{height}` for standard resolution
 * and `{width}x{height}@2x` for retina resolution.
 */
export enum Resolution {
  NonRetina16 = '16x16',
  Retina16 = '16x16@2x',
  NonRetina32 = '32x32',
  Retina32 = '32x32@2x',
  NonRetina128 = '128x128',
  Retina128 = '128x128@2x',
  NonRetina256 = '256x256',
  Retina256 = '256x256@2x',
  NonRetina512 = '512x512',
  Retina512 = '512x512@2x',
}

/**
 * Available folder icon themes.
 */
export enum FolderTheme {
  /** Generic folder icon style */
  Tahoe = 'Tahoe',
  /** MacOS Big Sur style (light variant) */
  BigSurLight = 'BigSur',
  /** MacOS Big Sur style (dark variant) */
  BigSurDark = 'BigSur.dark',
}
