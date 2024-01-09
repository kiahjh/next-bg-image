import { vi, test, describe, expect } from 'vitest';
import getCssData from '../lib';
import { componentCss } from '../css';

const cat = {
  src: `cat.jpg`,
  width: 660,
  height: 400,
};

describe(`component assembled css`, () => {
  test(`client optimization after initial page load larger than largest image`, () => {
    const data = getCssData([cat]);
    const css = componentCss(
      `__nbgi_1`,
      data,
      false,
      `cover`,
      `center`,
      1000, // <-- larger than fullsize img, so largest image is already loaded
    );
    expect(css).toMatchInlineSnapshot(`
      ".__nbgi_1 {
        background-image: url(cat.jpg);
      }
      /* range(min: 385, max: 640) removed after client load */
      /* range(min: 0, max: 384) removed after client load */
      .__nbgi_1 {
        background-size: cover;
      }
      .__nbgi_1 {
        background-position: center;
      }"
    `);
  });

  test(`client optimization after initial page load larger than largest image w/GRADIENT`, () => {
    const data = getCssData([cat, `linear-gradient(0deg, #000, #fff)`]);
    const css = componentCss(
      `__nbgi_1`,
      data,
      false,
      `cover`,
      `center`,
      1000, // <-- larger than fullsize img, so largest image is already loaded
    );
    expect(css).toMatchInlineSnapshot(`
      ".__nbgi_1 {
        background-image:
          url(cat.jpg),
          linear-gradient(0deg, #000, #fff);
      }
      /* range(min: 385, max: 640) removed after client load */
      /* range(min: 0, max: 384) removed after client load */
      .__nbgi_1 {
        background-size: cover;
      }
      .__nbgi_1 {
        background-position: center;
      }"
    `);
  });

  test(`small img non-lazy server css`, () => {
    const data = getCssData([cat]);
    const css = componentCss(`__nbgi_1`, data, false, `cover`, `center`, null);
    expect(css).toMatchInlineSnapshot(`
      "@media (min-width: 641px) {
        .__nbgi_1 {
          background-image: url(cat.jpg);
        }
      }
      @media (max-width: 640px) {
        .__nbgi_1 {
          background-image: url(downsized-cat.jpg?w=640);
        }
      }
      @media (max-width: 384px) {
        .__nbgi_1 {
          background-image: url(downsized-cat.jpg?w=384);
        }
      }
      .__nbgi_1 {
        background-size: cover;
      }
      .__nbgi_1 {
        background-position: center;
      }"`);
  });

  test(`small img lazy server css`, () => {
    const data = getCssData([cat]);
    const lazyCss = componentCss(`__nbgi_1`, data, true, `cover`, `center`, null);
    expect(lazyCss).toMatchInlineSnapshot(`
      "@media (min-width: 641px) {
        .__nbgi_1.__nbgi_loaded::after {
          background-image: url(cat.jpg);
        }
      }
      @media (max-width: 640px) {
        .__nbgi_1.__nbgi_loaded::after {
          background-image: url(downsized-cat.jpg?w=640);
        }
      }
      @media (max-width: 384px) {
        .__nbgi_1.__nbgi_loaded::after {
          background-image: url(downsized-cat.jpg?w=384);
        }
      }
      .__nbgi_1::before {
        background-image: url(blurred-cat.jpg);
      }
      .__nbgi_1::before {
        background-position: center;
      }
      .__nbgi_1::before {
        background-size: cover;
      }
      .__nbgi_1::after {
        background-position: center;
      }
      .__nbgi_1::after {
        background-size: cover;
      }"
    `);
  });
});

vi.mock(`../nextjs.js`, async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = { ...(await importOriginal<typeof import('../nextjs')>()) };
  mod.imgBaseUrl = (img) => `downsized-${img.src}`;
  mod.sizedImg = (baseUrl, width) => `${baseUrl}?w=${width}`;
  mod.blurImgUrl = (_, img) => `blurred-${img.src}`;
  return mod;
});
