export default function getImageData(
  srcSet: string,
  width: number,
  fullSizeSrc: string,
): Array<CssDecl> {
  const baseUrl = srcSet.split(/\s/)[0]?.split(`&`)[0];
  if (!baseUrl) {
    throw new Error(`Invalid srcSet: ${srcSet}`);
  }
  if (width <= 384) {
    return [
      {
        url: fullSizeSrc,
        type: 'unbounded',
      },
    ];
  }

  const imageData: Array<CssDecl> = [];
  let biggestWidth = 0;
  for (const imgWidth of IMG_SIZES) {
    if (imgWidth >= 384 && imgWidth <= width) {
      biggestWidth = imgWidth;
      imageData.push({
        url: `${baseUrl}&w=${imgWidth}&q=75`,
        type: 'max-width',
        width: imgWidth,
      });
    }
  }
  imageData.push({
    url: fullSizeSrc,
    type: 'min-width',
    width: biggestWidth + 1,
  });
  return imageData;
}

type CssDecl = { url: string } & (
  | { type: 'unbounded' }
  | { type: 'min-width'; width: number }
  | { type: 'max-width'; width: number }
);

const IMG_SIZES = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
];

export function generateMediaQuery(decl: CssDecl, id: string): string {
  switch (decl.type) {
    case 'unbounded':
      return `#${id} { background-image: url(${decl.url}); }`;
    case 'min-width':
      return `@media (min-width: ${decl.width}px) { #${id} { background-image: url(${decl.url}); } }`;
    case 'max-width':
      return `@media (max-width: ${decl.width}px) { #${id} { background-image: url(${decl.url}); } }`;
  }
}
