import { test, describe, expect } from 'vitest';
import type { MediaQueryRange } from '../types';
import * as extract from '../extract';

describe(`extract.imagesToPreload()`, () => {
  test(`no gradient layers`, () => {
    const ranges: MediaQueryRange[] = [
      {
        min: 0,
        max: 400,
        imageLayers: [{ type: `image`, url: `img-400.jpg`, width: 400, height: 400 }],
      },
      {
        min: 401,
        max: Infinity,
        imageLayers: [{ type: `image`, url: `img-800.jpg`, width: 700, height: 800 }],
      },
    ];

    const large = extract.imagesToPreload(ranges, 500);
    expect(large).toEqual([`img-800.jpg`]);

    const small = extract.imagesToPreload(ranges, 200);
    expect(small).toEqual([`img-400.jpg`]);
  });

  test(`with gradient layers`, () => {
    const ranges: MediaQueryRange[] = [
      {
        min: 0,
        max: 400,
        imageLayers: [
          { type: `gradient`, value: `` },
          { type: `image`, url: `img-400.jpg`, width: 400, height: 400 },
        ],
      },
      {
        min: 401,
        max: Infinity,
        imageLayers: [
          { type: `gradient`, value: `` },
          { type: `image`, url: `img-800.jpg`, width: 700, height: 800 },
        ],
      },
    ];

    const large = extract.imagesToPreload(ranges, 500);
    expect(large).toEqual([`img-800.jpg`]);

    const small = extract.imagesToPreload(ranges, 200);
    expect(small).toEqual([`img-400.jpg`]);
  });
});

const basicRanges: MediaQueryRange[] = [
  {
    min: 0,
    max: 400,
    imageLayers: [
      { type: `image`, url: `dog-400.jpg`, width: 400, height: 200 },
      { type: `gradient`, value: `` },
      { type: `image`, url: `cat-400.jpg`, width: 400, height: 400 },
    ],
  },
  {
    min: 401,
    max: Infinity,
    imageLayers: [
      { type: `image`, url: `dog-2000.jpg`, width: 2000, height: 1000 },
      { type: `gradient`, value: `` },
      { type: `image`, url: `cat-800.jpg`, width: 700, height: 800 },
    ],
  },
];

describe(`extract.preloadSrcSets()`, () => {
  test(`extracts cross-section of range url image data`, () => {
    expect(extract.preloadSrcSets(basicRanges)).toEqual([
      `dog-400.jpg 400w, dog-2000.jpg 401w`,
      `cat-400.jpg 400w, cat-800.jpg 401w`,
    ]);
  });
});

describe(`extract.urlImageSlices()`, () => {
  test(`extracts cross-section of range url image data`, () => {
    expect(extract.urlImageSlices(basicRanges)).toEqual([
      [
        {
          url: `dog-400.jpg`,
          size: { width: 400, height: 200 },
          rangeContext: { min: 0, max: 400 },
        },
        {
          url: `dog-2000.jpg`,
          size: { width: 2000, height: 1000 },
          rangeContext: { min: 401, max: Infinity },
        },
      ],
      [
        {
          url: `cat-400.jpg`,
          size: { width: 400, height: 400 },
          rangeContext: { min: 0, max: 400 },
        },
        {
          url: `cat-800.jpg`,
          size: { width: 700, height: 800 },
          rangeContext: { min: 401, max: Infinity },
        },
      ],
    ]);
  });
});
