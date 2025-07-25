import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  FolderTheme,
  generate,
  generateIconSet,
  type Resolution,
} from '@/index';

const EXAMPLES_DIR = path.resolve('examples');
const DEFAULT_EXAMPLE_PATH = path.resolve(EXAMPLES_DIR, 'apple.png');

describe('generate', () => {
  describe('success cases', () => {
    it('should generate a folder icon with default options', async () => {
      const expectedWidth = 256;
      const expectedHeight = 256;

      const example = fs.readFileSync(DEFAULT_EXAMPLE_PATH);
      const result = await generate(example);
      const metadata = await sharp(result).metadata();

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
      expect(metadata.format).toBe('png');
      expect(metadata.width).toBe(expectedWidth);
      expect(metadata.height).toBe(expectedHeight);
    });
  });

  describe('error cases', () => {
    it('should throw an error for invalid theme', async () => {
      const invalidTheme = 'invalid-theme' as unknown as FolderTheme;

      const example = fs.readFileSync(DEFAULT_EXAMPLE_PATH);

      await expect(generate(example, { theme: invalidTheme })).rejects.toThrow(
        'Unsupported theme: invalid-theme',
      );
    });

    it('should throw an error for invalid resolution', async () => {
      const invalidResolution = 'invalid-resolution' as unknown as Resolution;

      const example = fs.readFileSync(DEFAULT_EXAMPLE_PATH);

      await expect(
        generate(example, { resolution: invalidResolution }),
      ).rejects.toThrow('Unsupported resolution: invalid-resolution');
    });
  });

  describe('snapshot diff', () => {
    it('should generate different icons for different themes', async () => {
      const example = fs.readFileSync(DEFAULT_EXAMPLE_PATH);

      const [tahoeResult, darkResult, lightResult] = await Promise.all([
        generate(example, { theme: FolderTheme.Tahoe }),
        generate(example, { theme: FolderTheme.BigSurDark }),
        generate(example, { theme: FolderTheme.BigSurLight }),
      ]);

      await expect(tahoeResult).toMatchImageSnapshot();
      await expect(darkResult).toMatchImageSnapshot();
      await expect(lightResult).toMatchImageSnapshot();
    });

    it('should apply tint color to the filtered icon', async () => {
      const example = fs.readFileSync(DEFAULT_EXAMPLE_PATH);

      const tintResult = await generate(example, {
        filter: { tintColor: '#000000' },
      });

      await expect(tintResult).toMatchImageSnapshot();
    });
  });
});

describe('generateIconSet', () => {
  const DEFAULT_ICONSET_PATH = path.resolve('tests/test.iconset');

  describe('success cases', () => {
    beforeEach(() => {
      fs.rmSync(DEFAULT_ICONSET_PATH, { recursive: true, force: true });
    });

    it('should generate an iconset with default options', async () => {
      await generateIconSet(DEFAULT_EXAMPLE_PATH, DEFAULT_ICONSET_PATH);
    });
  });
});
