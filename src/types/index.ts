export interface Options {
  trim?: boolean;
  theme: FolderTheme;
  resolution: Resolution;
}

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

export enum FolderTheme {
  Tahoe = 'GenericFolderIcon.Tahoe',
  BigSurLight = 'GenericFolderIcon.BigSur',
  BigSurDark = 'GenericFolderIcon.BigSur.dark',
}
