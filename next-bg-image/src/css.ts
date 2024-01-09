import type { BreakpointCustomizableCssRule, CssData, MediaQueryRange } from './types';
import * as format from './format';

export function componentCss(
  id: string,
  cssData: CssData,
  lazyLoad: boolean,
  size: BreakpointCustomizableCssRule,
  position: BreakpointCustomizableCssRule,
  clientInitialWindowWidth: number | null,
): string {
  return (
    cssData.mediaQueryRanges
      .map((range) =>
        generateMediaQuery(
          id,
          range,
          lazyLoad,
          clientInitialWindowWidth,
          cssData.largestImageWidth,
        ),
      )
      .join(``) +
    (lazyLoad
      ? lazyCss(id, cssData.blurImageLayers, position, size)
      : generateResponsiveRuleCSS(id, `size`, size) +
        generateResponsiveRuleCSS(id, `position`, position))
  ).trim();
}

export function generateMediaQuery(
  id: string,
  range: MediaQueryRange,
  lazyLoad: boolean,
  initialClientWindowWidth: number | null,
  largestImageWidth: number,
): string {
  if (initialClientWindowWidth && range.max < initialClientWindowWidth) {
    return `/* range(min: ${range.min}, max: ${range.max}) removed after client load */\n`;
  }
  const selector = lazyLoad ? `.${id}.__nbgi_loaded::after` : `.${id}`;
  if (range.max !== Infinity) {
    return format.bgImageLayers(selector, range.imageLayers, {
      type: `max-width`,
      px: range.max,
    });
  }

  const alreadyLoadedLargestImages = (initialClientWindowWidth ?? -1) > largestImageWidth;
  if (range.min === 0 || alreadyLoadedLargestImages) {
    // one unbounded (no media query) rule is all that's needed
    return format.bgImageLayers(selector, range.imageLayers);
  }

  // this is the final, upper-range media query
  return format.bgImageLayers(selector, range.imageLayers, {
    type: `min-width`,
    px: range.min,
  });
}

export function lazyCss(
  id: string,
  blurredLayers: string[] | undefined,
  position: BreakpointCustomizableCssRule,
  size: BreakpointCustomizableCssRule,
): string {
  if (!blurredLayers) return ``;
  return [
    format.bgImageCss(`.${id}::before`, blurredLayers),
    generateResponsiveRuleCSS(id, `position`, position, `::before`),
    generateResponsiveRuleCSS(id, `size`, size, `::before`),
    generateResponsiveRuleCSS(id, `position`, position, `::after`),
    generateResponsiveRuleCSS(id, `size`, size, `::after`),
  ].join(``);
}

export function generateResponsiveRuleCSS(
  id: string,
  type: 'size' | 'position',
  rule: BreakpointCustomizableCssRule,
  pseudoSelector?: '::before' | '::after',
): string {
  const selector = `.${id}${pseudoSelector ?? ``}`;
  if (typeof rule === `string`) {
    return format.cssRule(selector, [[`background-${type}`, rule]]);
  }
  return Object.entries(rule).reduce((acc, [key, value]) => {
    const number = breakpointToNumber(key);
    if (!number) return acc;
    const rule = format.cssRule(selector, [[`background-${type}`, value]], {
      type: `min-width`,
      px: number,
    });
    return `${acc}\n${rule}`;
  }, format.cssRule(selector, [[`background-${type}`, rule.base]]));
}

function breakpointToNumber(size: string): number | null {
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
