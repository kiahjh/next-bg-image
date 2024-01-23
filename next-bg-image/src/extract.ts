import type {
  MediaQueryRange,
  CssBgImageLayer,
  CssUrlImageLayer,
  SizedUrlImage,
} from './types';

export function imagesToPreload(
  ranges: Array<MediaQueryRange>,
  windowWidth: number,
): string[] {
  const urlLayers =
    ranges
      .find((range) => range.min <= windowWidth && range.max >= windowWidth)
      ?.imageLayers.filter(isUrlImageLayer) ?? [];
  return urlLayers.map(({ url }) => url);
}

export function urlImageSlices(
  ranges: Array<MediaQueryRange>,
): Array<Array<SizedUrlImage>> {
  const slices: Array<Array<SizedUrlImage>> = [];
  for (const range of ranges) {
    for (let i = 0; i < range.imageLayers.length; i++) {
      const layer = range.imageLayers[i];
      if (!layer || layer.type !== `image`) continue;
      const image = layer;
      if (!slices[i]) slices[i] = [];
      slices[i]?.push({
        url: image.url,
        size: { width: image.width, height: image.height },
        rangeContext: { min: range.min, max: range.max },
      });
    }
  }
  // filter out empty slots of sparse array left by gradient layers
  return slices.filter((image) => image);
}

// TODO: experimental, for `eager` preloading, not verified to actually help
export function preloadSrcSets(ranges: Array<MediaQueryRange>): Array<string> {
  const srcSets: string[] = [];
  for (const slice of urlImageSlices(ranges)) {
    srcSets.push(
      slice
        .map((img) => {
          const max =
            img.rangeContext.max === Infinity
              ? img.rangeContext.min
              : img.rangeContext.max;
          return `${img.url} ${max}w`;
        })
        .join(`, `),
    );
  }
  return srcSets;
}

function isUrlImageLayer(layer: CssBgImageLayer): layer is CssUrlImageLayer {
  return layer.type === `image`;
}
