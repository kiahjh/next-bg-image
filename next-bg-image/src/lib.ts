import type { StaticImageData } from 'next/image';
import type {
  CssGradientString,
  MediaQueryRange,
  CssBgImageLayer,
  SupportedImageWidth,
  CssData,
} from './types';
import * as nextjs from './nextjs';

export default function cssData(
  srcPropLayers: Array<StaticImageData | CssGradientString>,
  minImageWidth?: number,
): CssData {
  const [layers, blurImageLayers, largestImageWidth] = extractData(srcPropLayers);
  const ranges: Array<MediaQueryRange> = [];
  let previousMax = -1;

  for (const imageWidth of requiredWidths(largestImageWidth, minImageWidth)) {
    const imageLayers: CssBgImageLayer[] = [];
    for (const layer of layers) {
      switch (layer.type) {
        case `gradient`:
          imageLayers.push({ type: `gradient`, value: layer.cssValue });
          break;
        case `image`:
          imageLayers.push({
            type: `image`,
            url: layer.widths[imageWidth],
            width: imageWidth,
            height: Math.round(imageWidth * (layer.fullsizeHeight / layer.fullsizeWidth)),
          });
          break;
        case `fullsizeFallback`:
          imageLayers.push({
            type: `image`,
            url: layer.url,
            width: layer.width,
            height: layer.height,
          });
          break;
      }
    }
    ranges.push({
      min: previousMax + 1,
      max: imageWidth,
      imageLayers: imageLayers,
    });
    previousMax = imageWidth;
  }

  ranges.push({
    min: previousMax + 1,
    max: Infinity,
    imageLayers: srcPropLayers.map((image) =>
      typeof image === `string`
        ? { type: `gradient`, value: image }
        : { type: `image`, url: image.src, width: image.width, height: image.height },
    ),
  });

  return {
    mediaQueryRanges: ranges.reverse(),
    blurImageLayers,
    largestImageWidth,
  };
}

type AllSupportedWidths = { [key in SupportedImageWidth]: string };
type LayerData =
  | {
      type: 'image';
      widths: AllSupportedWidths;
      fullsizeWidth: number;
      fullsizeHeight: number;
    }
  | { type: 'gradient'; cssValue: string }
  | { type: 'fullsizeFallback'; url: string; width: number; height: number };

function extractData(
  inputLayers: Array<StaticImageData | CssGradientString>,
): [layers: Array<LayerData>, placeholderImages: string[], largestImageWidth: number] {
  const layers: Array<LayerData> = [];
  const placeholderLayers: string[] = [];
  let largestImageWidth = 0;

  for (const inputLayer of inputLayers) {
    if (typeof inputLayer === `string`) {
      layers.push({ type: `gradient`, cssValue: inputLayer });
      placeholderLayers.push(inputLayer);
      continue;
    }

    const image = inputLayer;
    if (image.width > largestImageWidth) {
      largestImageWidth = inputLayer.width;
    }

    const baseUrl = nextjs.imgBaseUrl(image);
    if (baseUrl === null) {
      // can't resolve base url to derive widths, bail with fullsize fallback
      layers.push({
        type: `fullsizeFallback`,
        url: image.src,
        width: image.width,
        height: image.height,
      });
      placeholderLayers.push(`url(${image.src})`);
      continue;
    }

    placeholderLayers.push(`url(${nextjs.blurImgUrl(baseUrl, image)})`);
    const widths = nextjs.SUPPORTED_IMAGE_WIDTHS.reduce(
      (acc, size) => ({ ...acc, [size]: nextjs.sizedImg(baseUrl, size) }),
      {} as AllSupportedWidths,
    );
    layers.push({
      type: `image`,
      widths,
      fullsizeWidth: image.width,
      fullsizeHeight: image.height,
    });
  }
  return [layers, placeholderLayers, largestImageWidth];
}

function requiredWidths(
  largestImageLayer: number,
  minImageWidth?: number,
): SupportedImageWidth[] {
  return nextjs.SUPPORTED_IMAGE_WIDTHS.filter(
    (size) => size >= (minImageWidth ?? 384) && size < largestImageLayer,
  );
}
