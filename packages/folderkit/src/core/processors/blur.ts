import type { Processor } from '@folderkit/types/processor';
import sharp from 'sharp';

export interface BlurOptions {
  /** Number of steps for motion blur simulation */
  step: number;
  /** Distance of motion blur in pixels */
  distance: number;
  /** Angle of motion blur in degrees */
  angle: number;
}
export const blur =
  ({ step, distance, angle }: BlurOptions): Processor =>
  async (input: Buffer) => {
    // Simulate motion blur by creating multiple offset copies and blending them
    // Calculate x and y offsets based on angle and distance
    // Note: In ImageMagick, 0° is to the right, 90° is up, 180° is left, 270° is down
    // We need to adjust the angle to match this coordinate system
    const angleRad = (angle * Math.PI) / 180; // Convert to radians and adjust for coordinate system
    const xOffset = Math.round(Math.cos(angleRad) * distance);
    const yOffset = -Math.round(Math.sin(angleRad) * distance); // Negative because y-axis is inverted in image coordinates

    // Create a base image with transparency
    const { width, height } = await sharp(input).metadata();
    const baseImage = sharp({
      create: {
        width: width + Math.abs(xOffset) * 2,
        height: height + Math.abs(yOffset) * 2,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    // Load the source image
    const sourceBuffer = await sharp(input).ensureAlpha().toBuffer();

    // Create an array to hold all the compositing operations
    const composites: sharp.OverlayOptions[] = [];

    // Add multiple offset copies of the image with decreasing opacity
    for (let i = 0; i < step; i++) {
      const offsetX = Math.round((xOffset * i) / step);
      const offsetY = Math.round((yOffset * i) / step);
      const opacity = 1 / (i + 1); // Decrease opacity for each subsequent copy

      // Apply opacity using composite operation
      const offsetImage = await sharp(sourceBuffer)
        .composite([
          {
            input: Buffer.from([0, 0, 0, 255 * opacity]),
            raw: { width: 1, height: 1, channels: 4 },
            blend: 'dest-in',
            tile: true,
          },
        ])
        .toBuffer();

      composites.push({
        input: offsetImage,
        top: offsetY + Math.abs(yOffset),
        left: offsetX + Math.abs(xOffset),
        blend: 'over',
      });
    }

    // Composite all the layers
    return baseImage.composite(composites).extract({
      left: Math.abs(xOffset),
      top: Math.abs(yOffset),
      width,
      height,
    });
  };
