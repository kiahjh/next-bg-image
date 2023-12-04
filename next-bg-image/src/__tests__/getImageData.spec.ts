import { describe, expect, it } from "vitest";
import type { CssDecl } from "../lib";
import getImageData from "../lib";

describe(`getting useable data from srcSet`, () => {
  it(`should return an array of urls and widths`, () => {
    const src = `/_next/static/media/win.63858d56.jpeg`;
    const expected: CssDecl[] = [
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=384&q=75`,
          },
        ],
        min: 0,
        max: 384,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=640&q=75`,
          },
        ],
        min: 385,
        max: 640,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=750&q=75`,
          },
        ],
        min: 641,
        max: 750,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=828&q=75`,
          },
        ],
        min: 751,
        max: 828,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1080&q=75`,
          },
        ],
        min: 829,
        max: 1080,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1200&q=75`,
          },
        ],
        min: 1081,
        max: 1200,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1920&q=75`,
          },
        ],
        min: 1201,
        max: 1920,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=2048&q=75`,
          },
        ],
        min: 1921,
        max: 2048,
      },
      {
        images: [
          {
            type: `url`,
            value: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=3840&q=75`,
          },
        ],
        min: 2049,
        max: 3840,
      },
      {
        images: [
          {
            type: `url`,
            value: src,
          },
        ],
        min: 3841,
        max: Infinity,
      },
    ];
    expect(
      getImageData([{ src, height: 10000, width: 10000 }], false).decls,
    ).toEqual(expected);
    expect(
      getImageData([{ src, width: 1000, height: 1000 }], false).decls,
    ).toEqual([
      ...expected.slice(0, 4),
      {
        images: [
          {
            type: `url`,
            value: src,
          },
        ],
        min: 829,
        max: Infinity,
      },
    ]);
    expect(
      getImageData([{ src, width: 384, height: 384 }], false).decls,
    ).toEqual([
      {
        images: [
          {
            type: `url`,
            value: src,
          },
        ],
        min: 0,
        max: Infinity,
      },
    ]);
    expect(
      getImageData([{ src, width: 200, height: 200 }], false).decls,
    ).toEqual([
      {
        images: [
          {
            type: `url`,
            value: src,
          },
        ],
        min: 0,
        max: Infinity,
      },
    ]);
    expect(getImageData([{ src, width: 384, height: 384 }], true)).toEqual({
      blurry: [
        `url("/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=32&q=25")`,
      ],
      decls: [
        {
          images: [
            {
              type: `url`,
              value: src,
            },
          ],
          min: 0,
          max: Infinity,
        },
      ],
    });
  });
});
