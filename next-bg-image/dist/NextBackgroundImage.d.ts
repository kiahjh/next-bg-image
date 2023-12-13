import React from 'react';
import type { StaticImageData } from 'next/image';
import type { Rule } from './lib';
import './next-bg-image.css';
interface Props {
    src: StaticImageData | Array<StaticImageData | string>;
    children: React.ReactNode;
    lazyLoad?: boolean;
    lazyThreshold?: number | string;
    size?: Rule;
    position?: Rule;
    className?: string;
}
declare const NextBackgroundImage: React.FC<Props>;
export default NextBackgroundImage;
