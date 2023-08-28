import { describe, expect, it } from 'vitest';
import getImageData from '../lib';

describe(`getting useable data from srcSet`, () => {
  it(`should return an array of urls and widths`, () => {
    const srcSet = `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=16&q=75 16w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=32&q=75 32w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=48&q=75 48w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=64&q=75 64w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=96&q=75 96w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=128&q=75 128w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=256&q=75 256w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=384&q=75 384w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=640&q=75 640w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=750&q=75 750w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=828&q=75 828w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1080&q=75 1080w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1200&q=75 1200w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1920&q=75 1920w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=2048&q=75 2048w, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=3840&q=75 3840w`;
    const expected = [
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=16&q=75`,
        width: 16,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=32&q=75`,
        width: 32,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=48&q=75`,
        width: 48,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=64&q=75`,
        width: 64,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=96&q=75`,
        width: 96,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=128&q=75`,
        width: 128,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=256&q=75`,
        width: 256,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=384&q=75`,
        width: 384,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=640&q=75`,
        width: 640,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=750&q=75`,
        width: 750,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=828&q=75`,
        width: 828,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1080&q=75`,
        width: 1080,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1200&q=75`,
        width: 1200,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=1920&q=75`,
        width: 1920,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=2048&q=75`,
        width: 2048,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=3840&q=75`,
        width: 3840,
      },
    ];
    expect(getImageData(srcSet)).toEqual(expected);
  });

  it(`works with any number of spaces`, () => {
    const srcSet = `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=16&q=75 16w,/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=32&q=75 32w,  /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=48&q=75\n  48w`;
    expect(getImageData(srcSet)).toEqual([
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=16&q=75`,
        width: 16,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=32&q=75`,
        width: 32,
      },
      {
        url: `/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwin.63858d56.jpeg&w=48&q=75`,
        width: 48,
      },
    ]);
  });

  it(`works with an empty string`, () => {
    expect(getImageData('')).toEqual([]);
  });
});
