"use client";

import React, { useEffect, useId, useState } from "react";
import { unstable_getImgProps } from "next/image";
import type { StaticImageData } from "next/image";
import getImageData, { generateMediaQuery, lazyCss } from "./lib";
import "./next-bg-image.css";

interface Props {
  src: StaticImageData;
  children: React.ReactNode;
  lazyLoad?: boolean;
  size?: "cover" | "contain" | "full"; // TODO: add custom stuff
  position?: "center" | "top" | "bottom" | "left" | "right"; // TODO: add custom stuff
  className?: string;
}

const NextBackgroundImage: React.FC<Props> = ({
  src,
  children,
  className,
  lazyLoad = false,
  size = `cover`,
  position = `center`,
}) => {
  const id = useId().replace(/:/g, ``);
  const imageProps = unstable_getImgProps({
    src,
    alt: ``,
    sizes: `hello`,
    width: src.width,
    height: src.height,
    placeholder: `blur`,
  });
  const { decls, blurry } = getImageData(
    imageProps.props.srcSet || ``,
    src.width,
    src.src,
    lazyLoad,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 1000);
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            decls
              .map((decl) => generateMediaQuery(decl, id, lazyLoad))
              .join(`\n`) + lazyCss(blurry, id, position, size),
        }}
      />
      <div
        id={id}
        style={{
          backgroundSize: size,
          backgroundPosition: position,
          position: `relative`,
          // border: `8px solid red`,
        }}
        className={`next_bg_image__container ${ready && `loaded`} ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default NextBackgroundImage;
