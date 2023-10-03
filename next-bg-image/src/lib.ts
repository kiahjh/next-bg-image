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
          type: `unbounded`,
        },
      ],
      blurry: lazyLoad ? `${baseUrl}&w=16&q=25` : undefined,
    };
  }

  const decls: Array<CssDecl> = [];
  let biggestWidth = 0;
  for (const imgWidth of IMG_SIZES) {
    if (imgWidth >= 384 && imgWidth <= width) {
      biggestWidth = imgWidth;
      decls.push({
        url: `${baseUrl}&w=${imgWidth}&q=75`,
        type: `max-width`,
        width: imgWidth,
      });
    }
  }
  decls.push({
    url: fullSizeSrc,
    type: `min-width`,
    width: biggestWidth + 1,
  });
  return {
    decls,
    blurry: lazyLoad ? `${baseUrl}&w=32&q=25` : undefined,
  };
}

export type CssDecl = { url: string } & (
  | { type: "unbounded" }
  | { type: "min-width"; width: number }
  | { type: "max-width"; width: number }
);

const IMG_SIZES = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
];

export function generateMediaQuery(
  decl: CssDecl,
  id: string,
  lazyLoad: boolean,
): string {
  const selector = lazyLoad ? `#${id}.loaded::after` : `#${id}`;
  switch (decl.type) {
    case `unbounded`:
      return `${selector} { background-image: url(${decl.url}); }`;
    case `min-width`:
      return `@media (min-width: ${decl.width}px) { ${selector} { background-image: url(${decl.url}); } }`;
    case `max-width`:
      return `@media (max-width: ${decl.width}px) { ${selector} { background-image: url(${decl.url}); } }`;
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
