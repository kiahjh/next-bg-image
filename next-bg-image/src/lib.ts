export default function getImageData(
  srcSet: string,
  width: number,
  fullSizeSrc: string,
  lazyLoad: boolean,
): { decls: Array<CssDecl>; blurry?: string } {
  const baseUrl = srcSet.split(/\s/)[0]?.split(`&`)[0];
  if (!baseUrl) {
    throw new Error(`Invalid srcSet: ${srcSet}`);
  }
  if (width <= 384) {
    return {
      decls: [
        {
          url: fullSizeSrc,
          min: 0,
          max: Infinity,
        },
      ],
      blurry: lazyLoad ? `${baseUrl}&w=16&q=25` : undefined,
    };
  }

  const decls: Array<CssDecl> = [];
  let previousMax = -1;
  for (const imgWidth of IMG_SIZES) {
    if (imgWidth >= 384 && imgWidth <= width) {
      decls.push({
        url: `${baseUrl}&w=${imgWidth}&q=75`,
        min: previousMax + 1,
        max: imgWidth,
      });
      previousMax = imgWidth;
    }
  }
  decls.push({
    url: fullSizeSrc,
    min: previousMax + 1,
    max: Infinity,
  });
  return {
    decls,
    blurry: lazyLoad ? `${baseUrl}&w=32&q=25` : undefined,
  };
}

export type CssDecl = { url: string; min: number; max: number };

const IMG_SIZES = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
];

export function generateMediaQuery(
  decl: CssDecl,
  id: string,
  lazyLoad: boolean,
  initialWindowWidth: number | null,
): string {
  if (initialWindowWidth && decl.max < initialWindowWidth) return ``;
  const selector = lazyLoad ? `#${id}.loaded::after` : `#${id}`;
  if (decl.min === 0 && decl.max === Infinity) {
    return `${selector} { background-image: url(${decl.url}); }`;
  }
  switch (decl.max) {
    case Infinity:
      return `@media (min-width: ${decl.min}px) { ${selector} { background-image: url(${decl.url}); } }`;
    default:
      return `@media (max-width: ${decl.max}px) { ${selector} { background-image: url(${decl.url}); } }`;
  }
}

export function lazyCss(
  blurry: string | undefined,
  id: string,
  position: string,
  size: string,
): string {
  if (!blurry) return ``;
  return `
    #${id}::before {
      background-image: url("${blurry}");
      background-size: ${size};
      background-position: ${position};
    }
    #${id}::after {
      background-size: ${size};
      background-position: ${position};
    }
`;
}
