"use client";

import React, { useEffect, useId, useState } from "react";
import type { StaticImageData } from "next/image";
import type { Rule } from "./lib";
import { generateResponsiveRuleCSS } from "./lib";
import getImageData, { generateMediaQuery, lazyCss } from "./lib";
import { useIntersectionObserver } from "./hooks";

type IntrinsicProps =
  | ({ as?: "div" } & JSX.IntrinsicElements["div"])
  | ({ as: "span" } & JSX.IntrinsicElements["span"])
  | ({ as: "a" } & JSX.IntrinsicElements["a"])
  | ({ as: "button" } & JSX.IntrinsicElements["button"])
  | ({ as: "p" } & JSX.IntrinsicElements["p"])
  | ({ as: "h1" } & JSX.IntrinsicElements["h1"])
  | ({ as: "h2" } & JSX.IntrinsicElements["h2"])
  | ({ as: "h3" } & JSX.IntrinsicElements["h3"])
  | ({ as: "h4" } & JSX.IntrinsicElements["h4"])
  | ({ as: "h5" } & JSX.IntrinsicElements["h5"])
  | ({ as: "h6" } & JSX.IntrinsicElements["h6"])
  | ({ as: "ul" } & JSX.IntrinsicElements["ul"])
  | ({ as: "ol" } & JSX.IntrinsicElements["ol"])
  | ({ as: "li" } & JSX.IntrinsicElements["li"])
  | ({ as: "dl" } & JSX.IntrinsicElements["dl"])
  | ({ as: "dt" } & JSX.IntrinsicElements["dt"])
  | ({ as: "dd" } & JSX.IntrinsicElements["dd"])
  | ({ as: "table" } & JSX.IntrinsicElements["table"])
  | ({ as: "tr" } & JSX.IntrinsicElements["tr"])
  | ({ as: "td" } & JSX.IntrinsicElements["td"])
  | ({ as: "th" } & JSX.IntrinsicElements["th"])
  | ({ as: "form" } & JSX.IntrinsicElements["form"])
  | ({ as: "input" } & JSX.IntrinsicElements["input"])
  | ({ as: "textarea" } & JSX.IntrinsicElements["textarea"])
  | ({ as: "label" } & JSX.IntrinsicElements["label"])
  | ({ as: "section" } & JSX.IntrinsicElements["section"])
  | ({ as: "header" } & JSX.IntrinsicElements["header"])
  | ({ as: "footer" } & JSX.IntrinsicElements["footer"])
  | ({ as: "nav" } & JSX.IntrinsicElements["nav"])
  | ({ as: "aside" } & JSX.IntrinsicElements["aside"])
  | ({ as: "main" } & JSX.IntrinsicElements["main"])
  | ({ as: "article" } & JSX.IntrinsicElements["article"])
  | ({ as: "figure" } & JSX.IntrinsicElements["figure"])
  | ({ as: "figcaption" } & JSX.IntrinsicElements["figcaption"])
  | ({ as: "blockquote" } & JSX.IntrinsicElements["blockquote"]);

type Props = {
  src: StaticImageData | Array<StaticImageData | string>;
  children: React.ReactNode;
  lazyLoad?: boolean;
  lazyThreshold?: number | string;
  size?: Rule;
  position?: Rule;
  minImageWidth?: number;
} & IntrinsicProps;

const NextBackgroundImage: React.FC<Props> = ({
  src: srcProp,
  children,
  className,
  lazyLoad = false,
  lazyThreshold = 500,
  minImageWidth,
  size = `cover`,
  position = `center`,
  as: Element = `div`,
  ...props
}) => {
  const src = Array.isArray(srcProp) ? srcProp : [srcProp];
  const id = `__nbgi_` + useId().replace(/:/g, ``);
  const { decls, blurry } = getImageData(src, lazyLoad, minImageWidth ?? 384);

  const imageSize = (decls.find((decl) => decl.max === Infinity)?.min ?? 1) - 1;

  const { intersected, ref } = useIntersectionObserver(lazyLoad, {
    rootMargin:
      typeof lazyThreshold === `string` ? lazyThreshold : `${lazyThreshold}px`,
    threshold: 0,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [initialWindowWidth, setInitialWindowWidth] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (intersected) {
      const imgs = decls
        .find(
          (decl) =>
            decl.min <= window.innerWidth && decl.max >= window.innerWidth,
        )
        ?.images.filter(
          (img): img is { type: "url"; value: string } => img.type === `url`,
        );
      if (imgs) {
        const promise: Promise<unknown[]> = Promise.all(
          imgs.map(
            ({ value: url }) =>
              new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(undefined);
                img.onerror = () => resolve(undefined);
                img.src = url;
              }),
          ),
        );
        promise.then(() => setImageLoaded(true));
      }
    }
  }, [intersected, decls]);

  useEffect(() => {
    setInitialWindowWidth(window.innerWidth);
  }, []);

  return (
    <>
      <style
        id={`${id}_style`}
        dangerouslySetInnerHTML={{
          __html:
            decls
              .reverse()
              .map((decl) =>
                generateMediaQuery(
                  decl,
                  id,
                  lazyLoad,
                  initialWindowWidth,
                  (initialWindowWidth ?? 0) > imageSize,
                ),
              )
              .join(`\n`) +
            (lazyLoad
              ? lazyCss(blurry, id, position, size)
              : generateResponsiveRuleCSS(`size`, size, id) +
                generateResponsiveRuleCSS(`position`, position, id)),
        }}
      />
      {/* @ts-ignore */}
      <Element
        // @ts-ignore
        ref={ref}
        style={{ position: `relative` }}
        className={`${id} __nbgi_wrap${imageLoaded ? ` loaded` : ``}${
          className ? ` ${className}` : ``
        }`}
        {...props}
      >
        {children}
      </Element>
    </>
  );
};

export default NextBackgroundImage;
