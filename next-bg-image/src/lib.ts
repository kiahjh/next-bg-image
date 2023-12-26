import { unstable_getImgProps } from "next/image";
import type { StaticImageData } from "next/image";

export default function getImageData(
  inputImages: Array<{ src: string; width: number; height: number } | string>,
  lazyLoad: boolean,
  minImageWidth: number,
): { decls: Array<CssDecl>; blurry?: string[] } {
  const decls: Array<CssDecl> = [];
  let previousMax = -1;
  const largestImage = inputImages
    .filter((image): image is StaticImageData => typeof image !== `string`)
    .reduce((acc, image) => Math.max(acc, image.width), 0);
  const blurries: string[] = [];
  const images = inputImages.map((image) => {
    if (typeof image === `string`) {
      blurries.push(image);
      return image;
    }
    const imgProps = unstable_getImgProps({
      src: image.src,
      alt: ``,
      width: image.width,
      height: image.height,
    });
    if (imgProps.props.srcSet === undefined) {
      return `url(${image.src})`;
    }
    const baseUrl = imgProps.props.srcSet.split(/\s/)[0]?.split(`&`)[0];
    blurries.push(`url("${baseUrl}&w=32&q=25")`);
    type QualityMap = { [key in ImgSize]: string };
    const imgQualityMap = IMG_SIZES.reduce(
      (acc, size) => ({ ...acc, [size]: `${baseUrl}&w=${size}&q=75` }),
      {} as QualityMap,
    );
    return imgQualityMap;
  });
  for (const imageWidth of IMG_SIZES.filter(
    (size) => size >= minImageWidth && size < largestImage,
  )) {
    const curDeclImages: DeclImage[] = [];
    for (const image of images) {
      if (typeof image === `string`) {
        curDeclImages.push({ type: `gradient`, value: image });
      } else {
        curDeclImages.push({ type: `url`, value: image[imageWidth] });
      }
    }
    decls.push({
      images: curDeclImages,
      min: previousMax + 1,
      max: imageWidth,
    });
    previousMax = imageWidth;
  }

  decls.push({
    min: previousMax + 1,
    max: Infinity,
    images: inputImages.map((image) => {
      if (typeof image === `string`) {
        return { type: `gradient`, value: image };
      } else {
        return { type: `url`, value: image.src };
      }
    }),
  });

  return { decls, blurry: lazyLoad ? blurries : undefined };
}

export type CssDecl = {
  images: Array<DeclImage>;
  min: number;
  max: number;
};

export type DeclImage = { type: "url" | "gradient"; value: string };

const IMG_SIZES = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
] as const;

type ImgSize = (typeof IMG_SIZES)[number];

export function generateMediaQuery(
  decl: CssDecl,
  id: string,
  lazyLoad: boolean,
  initialWindowWidth: number | null,
): string {
  if (initialWindowWidth && decl.max < initialWindowWidth) return ``;
  const selector = lazyLoad ? `.${id}.loaded::after` : `.${id}`;
  const bgImageValue = decl.images
    .map((image) =>
      image.type === `url` ? `url(${image.value})` : image.value,
    )
    .join(`, `);
  if (decl.min === 0 && decl.max === Infinity) {
    return `${selector} { background-image: ${bgImageValue}; }`;
  }
  switch (decl.max) {
    case Infinity:
      return `@media (min-width: ${decl.min}px) { ${selector} { background-image: ${bgImageValue}; } }`;
    default:
      return `@media (max-width: ${decl.max}px) { ${selector} { background-image: ${bgImageValue}; } }`;
  }
}

export function lazyCss(
  blurry: string[] | undefined,
  id: string,
  position: Rule,
  size: Rule,
): string {
  if (!blurry) return ``;
  return `
    .${id}::before {
      background-image: ${blurry.join(`, `)};
    }
    ${generateResponsiveRuleCSS(`position`, position, id, `::before`)}
    ${generateResponsiveRuleCSS(`size`, size, id, `::before`)}
    ${generateResponsiveRuleCSS(`position`, position, id, `::after`)}
    ${generateResponsiveRuleCSS(`size`, size, id, `::after`)}
`;
}

export type TWSize = "sm" | "md" | "lg" | "xl" | "2xl";
export type Rule =
  | string
  | ({
      [key in TWSize]?: string;
    } & {
      [key in number]: string;
    } & { default: string });

export function generateResponsiveRuleCSS(
  type: "size" | "position",
  rule: Rule,
  id: string,
  pseudoSelector?: "::before" | "::after",
): string {
  const selector = `.${id}${pseudoSelector ?? ``}`;
  if (typeof rule === `string`) {
    return `${selector} { background-${type}: ${rule}; }`;
  }
  return Object.entries(rule).reduce((acc, [key, value]) => {
    const number = sizeToNumber(key);
    if (!number) return acc;
    return `${acc}\n@media (min-width: ${number}px) { ${selector} { background-${type}: ${value}; } }`;
  }, `${selector} { background-${type}: ${rule.default}; }`);
}

function sizeToNumber(size: string): number | null {
  switch (size) {
    case `sm`:
      return 640;
    case `md`:
      return 768;
    case `lg`:
      return 1024;
    case `xl`:
      return 1280;
    case `2xl`:
      return 1536;
    default:
      if (isNaN(Number(size))) return null;
      return Number(size);
  }
}
