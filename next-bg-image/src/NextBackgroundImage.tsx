import React, { useId } from 'react';
import { StaticImageData, unstable_getImgProps } from 'next/image';
import getImageData from './lib';

interface Props {
  src: StaticImageData;
  children: React.ReactNode;
  size?: 'cover' | 'contain' | 'full'; // TODO: add custom stuff
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'; // TODO: add custom stuff
  className?: string;
}

const NextBackgroundImage: React.FC<Props> = ({
  src,
  children,
  className,
  size = 'cover',
  position = 'center',
}) => {
  const id = useId().replace(/:/g, '');
  const imageProps = unstable_getImgProps({
    src,
    alt: ``,
    sizes: `hello`,
    width: src.width,
    height: src.height,
  });
  const data = getImageData(imageProps.props.srcSet || ``);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `${data
            .map(
              (img) => `
            @media (max-width: ${img.width}px) {
              #${id} {
                background-image: url(${img.url});
              }
            }
          `,
            )
            .join(`\n`)}`,
        }}
      />
      <div
        className={className}
        id={id}
        style={{
          backgroundSize: size,
          backgroundPosition: position,
          border: `solid 8px red`,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default NextBackgroundImage;
