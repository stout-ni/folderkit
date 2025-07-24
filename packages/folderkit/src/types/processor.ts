import type sharp from 'sharp';

export type Processor = (input: Buffer) => sharp.Sharp | Promise<sharp.Sharp>;
