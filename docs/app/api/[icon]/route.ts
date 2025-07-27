import { FolderTheme, generate, type Options, Resolution } from 'folderkit';
import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import sharp from 'sharp';
import * as si from 'simple-icons';
import { capitalize, getResolutionSize, isValueInEnum } from './utils';

type QueryParams = {
  brand?: string;
  theme?: string;
  resolution?: string;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ icon: string }> },
) => {
  try {
    const { icon } = await params;
    const { theme, brand, resolution } = getValidatedParams(
      request.nextUrl.searchParams,
    );

    // Get and process the SVG
    const exportName = `si${capitalize(icon)}`;
    if (!(exportName in si)) notFound();

    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: Dynamic access is needed for dynamic icon lookup
    const { svg, hex } = si[exportName as keyof typeof si] as si.SimpleIcon;
    const resolutionSize = getResolutionSize(resolution);

    const resizedSvg = await sharp(Buffer.from(svg, 'utf-8'))
      .resize(resolutionSize, resolutionSize, { fit: 'contain' })
      .toBuffer();

    // Prepare options for folder icon generation
    const options: Options = {
      resolution,
      ...(theme && { theme }),
      ...(brand && { filter: { tintColor: `#${hex}` } }),
    };

    const buffer = await generate(resizedSvg, options);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating folder icon:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

const getValidatedParams = (searchParams: URLSearchParams) => {
  const {
    theme,
    brand,
    resolution = Resolution.NonRetina256,
  } = Object.fromEntries(searchParams.entries()) as QueryParams;

  return {
    theme: isValueInEnum(FolderTheme, theme)
      ? (theme as FolderTheme)
      : undefined,
    brand: brand === 'true',
    resolution: isValueInEnum(Resolution, resolution)
      ? resolution
      : Resolution.NonRetina256,
  };
};
