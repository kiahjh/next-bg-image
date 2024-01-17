import type { CssBgImageLayer } from "./types";

export function bgImageLayers(
  selector: string,
  imageLayers: Array<CssBgImageLayer>,
  mediaQuery?: { type: "min-width" | "max-width"; px: number },
): string {
  return bgImageCss(
    selector,
    imageLayers.map((image) =>
      image.type === `image` ? `url(${image.url})` : image.value,
    ),
    mediaQuery,
  );
}

export function bgImageCss(
  selector: string,
  images: string[],
  mediaQuery?: { type: "min-width" | "max-width"; px: number },
): string {
  let value = images.join(mediaQuery ? `,\n      ` : `,\n    `);
  if (images.length > 1) {
    value = (mediaQuery ? `\n      ` : `\n    `) + value;
  }
  return cssRule(selector, [[`background-image`, value]], mediaQuery);
}

export function cssRule(
  selector: string,
  decls: Array<[property: string, value: string]>,
  mediaQuery?: { type: "min-width" | "max-width"; px: number },
): string {
  const joinedDeclString = decls
    .map(
      ([property, val]) =>
        `${property}:${val.startsWith(`\n`) ? val : ` ${val}`}`,
    )
    .join(mediaQuery ? `;\n      ` : `;\n  `);
  if (!mediaQuery) {
    return `${selector} {\n  ${joinedDeclString};\n}\n`;
  } else {
    return `
@media (${mediaQuery.type}: ${mediaQuery.px}px) {
  ${selector} {
    ${joinedDeclString};
  }
}
`.trimStart();
  }
}
