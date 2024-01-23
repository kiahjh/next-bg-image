'use client';

import React, { useEffect, useId, useState } from 'react';
import type { StaticImageData } from 'next/image';
import type {
  IntrinsicProps,
  CssGradientString,
  BreakpointCustomizableCssRule,
} from './types';
import { componentCss } from './css';
import getCssData from './lib';
import { useIntersectionObserver } from './hooks';
import * as extract from './extract';

type Props = {
  src: StaticImageData | Array<StaticImageData | CssGradientString>;
  children?: React.ReactNode;
  lazyLoad?: boolean;
  eager?: boolean;
  lazyThreshold?: number | string;
  size?: BreakpointCustomizableCssRule;
  position?: BreakpointCustomizableCssRule;
  minImageWidth?: number;
} & IntrinsicProps;

const NextBackgroundImage: React.FC<Props> = ({
  src: srcProp,
  children,
  className,
  lazyLoad = false,
  eager: inputEager = false,
  lazyThreshold = 500,
  minImageWidth,
  size = `cover`,
  position = `center`,
  as: Element = `div`,
  ...props
}) => {
  const layers = Array.isArray(srcProp) ? srcProp : [srcProp];
  const cssData = getCssData(layers, minImageWidth);
  const id = `__nbgi_` + useId().replace(/:/g, ``);

  const srcSets = extract.preloadSrcSets(cssData.mediaQueryRanges);

  const { intersected, ref } = useIntersectionObserver(lazyLoad, {
    rootMargin: typeof lazyThreshold === `string` ? lazyThreshold : `${lazyThreshold}px`,
    threshold: 0,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [initialWindowWidth, setInitialWindowWidth] = useState<number | null>(null);
  const [eager, setEager] = useState(inputEager);

  useEffect(() => {
    if (intersected) {
      const promise: Promise<unknown> = Promise.all(
        extract.imagesToPreload(cssData.mediaQueryRanges, window.innerWidth).map(
          (url) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve;
              img.src = url;
            }),
        ),
      );
      promise.then(() => setImageLoaded(true));
    }
  }, [intersected, cssData.mediaQueryRanges]);

  useEffect(() => {
    setInitialWindowWidth(window.innerWidth);
    setEager(false);
  }, []);

  return (
    <>
      {eager &&
        srcSets.map((srcSet) => (
          <img
            key={srcSet}
            srcSet={srcSet}
            // @ts-ignore
            fetchPriority="high"
            alt=""
            style={{
              display: `inline-block`,
              position: `absolute`,
              overflow: `hidden`,
              clip: `rect(0 0 0 0)`,
              height: 1,
              margin: -1,
              padding: 0,
              border: 0,
            }}
          />
        ))}
      {/* @ts-ignore */}
      <Element
        // @ts-ignore
        ref={ref}
        className={[
          className,
          id,
          lazyLoad ? `__nbgi_lazy` : ``,
          lazyLoad && imageLoaded ? `__nbgi_loaded` : ``,
        ]
          .filter(Boolean)
          .join(` `)}
        {...props}
      >
        {children}
      </Element>
      <style
        id={`${id}_style`}
        dangerouslySetInnerHTML={{
          __html: componentCss(id, cssData, lazyLoad, size, position, initialWindowWidth),
        }}
      />
    </>
  );
};

export default NextBackgroundImage;
