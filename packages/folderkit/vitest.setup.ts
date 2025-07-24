import path from 'node:path';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import { expect } from 'vitest';

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    customDiffDir: path.resolve('tests/snapshots/diff'),
    customSnapshotsDir: path.resolve('tests/snapshots'),
  }),
});
