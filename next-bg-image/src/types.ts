import type { SUPPORTED_IMAGE_WIDTHS } from './nextjs';

export interface MediaQueryRange {
  min: number;
  max: number;
  imageLayers: Array<CssBgImageLayer>;
}

export interface CssUrlImageLayer {
  type: 'image';
  url: string;
  width: number;
  height: number;
}

export interface CssGradientLayer {
  type: 'gradient';
  value: string;
}

export type CssBgImageLayer = CssUrlImageLayer | CssGradientLayer;

export type CssGradientString = string;

export interface CssData {
  mediaQueryRanges: Array<MediaQueryRange>;
  blurImageLayers: string[];
  largestImageWidth: number;
}

export interface SizedUrlImage {
  url: string;
  size: { width: number; height: number };
  rangeContext: { min: number; max: number };
}

export type BreakpointCustomizableCssRule =
  | string
  | ({
      [key in 'sm' | 'md' | 'lg' | 'xl' | '2xl']?: string;
    } & {
      [key in number]: string;
    } & {
      base: string;
    });

export type SupportedImageWidth = (typeof SUPPORTED_IMAGE_WIDTHS)[number];

export type IntrinsicProps =
  | ({ as?: 'div' } & JSX.IntrinsicElements['div'])
  | ({ as: 'span' } & JSX.IntrinsicElements['span'])
  | ({ as: 'a' } & JSX.IntrinsicElements['a'])
  | ({ as: 'button' } & JSX.IntrinsicElements['button'])
  | ({ as: 'p' } & JSX.IntrinsicElements['p'])
  | ({ as: 'h1' } & JSX.IntrinsicElements['h1'])
  | ({ as: 'h2' } & JSX.IntrinsicElements['h2'])
  | ({ as: 'h3' } & JSX.IntrinsicElements['h3'])
  | ({ as: 'h4' } & JSX.IntrinsicElements['h4'])
  | ({ as: 'h5' } & JSX.IntrinsicElements['h5'])
  | ({ as: 'h6' } & JSX.IntrinsicElements['h6'])
  | ({ as: 'ul' } & JSX.IntrinsicElements['ul'])
  | ({ as: 'ol' } & JSX.IntrinsicElements['ol'])
  | ({ as: 'li' } & JSX.IntrinsicElements['li'])
  | ({ as: 'dl' } & JSX.IntrinsicElements['dl'])
  | ({ as: 'dt' } & JSX.IntrinsicElements['dt'])
  | ({ as: 'dd' } & JSX.IntrinsicElements['dd'])
  | ({ as: 'table' } & JSX.IntrinsicElements['table'])
  | ({ as: 'tr' } & JSX.IntrinsicElements['tr'])
  | ({ as: 'td' } & JSX.IntrinsicElements['td'])
  | ({ as: 'th' } & JSX.IntrinsicElements['th'])
  | ({ as: 'form' } & JSX.IntrinsicElements['form'])
  | ({ as: 'input' } & JSX.IntrinsicElements['input'])
  | ({ as: 'textarea' } & JSX.IntrinsicElements['textarea'])
  | ({ as: 'label' } & JSX.IntrinsicElements['label'])
  | ({ as: 'section' } & JSX.IntrinsicElements['section'])
  | ({ as: 'header' } & JSX.IntrinsicElements['header'])
  | ({ as: 'footer' } & JSX.IntrinsicElements['footer'])
  | ({ as: 'nav' } & JSX.IntrinsicElements['nav'])
  | ({ as: 'aside' } & JSX.IntrinsicElements['aside'])
  | ({ as: 'main' } & JSX.IntrinsicElements['main'])
  | ({ as: 'article' } & JSX.IntrinsicElements['article'])
  | ({ as: 'figure' } & JSX.IntrinsicElements['figure'])
  | ({ as: 'figcaption' } & JSX.IntrinsicElements['figcaption'])
  | ({ as: 'blockquote' } & JSX.IntrinsicElements['blockquote']);
