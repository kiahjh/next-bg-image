import type {
  BreakpointCustomizableCssRule,
  CssData,
  MediaQueryRange,
} from "./types";
import * as format from "./format";

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
      : generateResponsiveRuleCSS(id, position, size))
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

  const alreadyLoadedLargestImages =
    (initialClientWindowWidth ?? -1) > largestImageWidth;
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
    generateResponsiveRuleCSS(id, position, size, `::before`),
    generateResponsiveRuleCSS(id, position, size, `::after`),
  ].join(``);
}

export function generateResponsiveRuleCSS(
  id: string,
  position: BreakpointCustomizableCssRule,
  size: BreakpointCustomizableCssRule,
  pseudoSelector?: "::before" | "::after",
): string {
  const selector = `.${id}${pseudoSelector ?? ``}`;
  switch (true) {
    case typeof position === `string` && typeof size === `string`:
      return format.cssRule(selector, [
        [`background-size`, size],
        [`background-position`, position],
      ]);
    case typeof position === `object` && typeof size === `string`:
      return customizedCssRule(
        position,
        selector,
        `position`,
        format.cssRule(selector, [
          [`background-size`, size],
          [`background-position`, position.base],
        ]),
      );
    case typeof position === `string` && typeof size === `object`:
      return customizedCssRule(
        size,
        selector,
        `size`,
        format.cssRule(selector, [
          [`background-size`, size.base],
          [`background-position`, position],
        ]),
      );
    case typeof position === `object` && typeof size === `object`:
      return customizedCssRule(
        size,
        selector,
        `size`,
        customizedCssRule(
          position,
          selector,
          `position`,
          format.cssRule(selector, [
            [`background-size`, size.base],
            [`background-position`, position.base],
          ]),
        ),
      );
    default:
      return ``;
  }
}

function customizedCssRule(
  rule: Exclude<BreakpointCustomizableCssRule, string>,
  selector: string,
  property: "size" | "position",
  initialValue: string,
): string {
  return Object.entries(rule).reduce((acc, [key, value]) => {
    const number = breakpointToNumber(key);
    if (!number) return acc;
    const rule = format.cssRule(selector, [[`background-${property}`, value]], {
      type: `min-width`,
      px: number,
    });
    return `${acc}${rule}`;
  }, initialValue);
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
