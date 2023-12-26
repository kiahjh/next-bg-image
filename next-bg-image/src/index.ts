import NextBgImage from './NextBackgroundImage';
import NextBgStaticCss from './StaticCss';

export default NextBgImage;

export { NextBgStaticCss };

export function bgColor(color: string): string {
  return `linear-gradient(${color}, ${color})`;
}
