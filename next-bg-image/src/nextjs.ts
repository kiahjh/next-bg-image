import { unstable_getImgProps } from 'next/image';
import type { StaticImageData } from 'next/image';

export function imgBaseUrl(image: StaticImageData): string | null {
  const imgProps = unstable_getImgProps({
    src: image.src,
    alt: ``,
    width: image.width,
    height: image.height,
  });

  return imgProps.props.srcSet?.split(/\s/)[0]?.split(`&`)[0] ?? null;
}

export function sizedImg(baseUrl: string, width: number): string {
  return `${baseUrl}&w=${width}&q=75`;
}

export function blurImgUrl(baseUrl: string, image: StaticImageData): string {
  if (image.blurDataURL) {
    return image.blurDataURL;
  } else {
    // `w=8&q=70` seems to be a magic query that tells nextjs to output
    // a blurred svg placeholder, it's same as `blurDataURL` above
    return `${baseUrl}&w=8&q=70`;
  }
}

export const SUPPORTED_IMAGE_WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const;
