'use client';

import React, { useEffect, useId, useState } from 'react';
import ReactDOM from 'react-dom';
import * as routerExport from 'next/navigation';
import Head from 'next/head';
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
  eager = false,
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

  const { intersected, ref } = useIntersectionObserver(lazyLoad, {
    rootMargin: typeof lazyThreshold === `string` ? lazyThreshold : `${lazyThreshold}px`,
    threshold: 0,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [initialWindowWidth, setInitialWindowWidth] = useState<number | null>(null);

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
  }, []);

  return (
    <>
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
      {eager && (
        <ImagePreload srcSets={extract.preloadSrcSets(cssData.mediaQueryRanges)} />
      )}
    </>
  );
};

export default NextBackgroundImage;

const ImagePreload: React.FC<{ srcSets: string[] }> = ({ srcSets }) => {
  const isAppRouter = Object.prototype.toString.call(routerExport).includes(`Module`);

  if (isAppRouter && ReactDOM.preload) {
    srcSets.forEach((srcSet) => {
      ReactDOM.preload(`...`, {
        // @ts-expect-error (the next ppl said it was ok)
        as: `image`,
        imageSrcSet: srcSet,
        fetchPriority: `high`,
      });
    });
    return null;
  }

  return (
    <Head>
      {srcSets.map((srcSet) => (
        <link
          rel="preload"
          as="image"
          imageSrcSet={srcSet}
          fetchpriority="high"
          key={srcSet}
        />
      ))}
    </Head>
  );
};
