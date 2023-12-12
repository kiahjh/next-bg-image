import NextBgImage from './NextBackgroundImage';

export default NextBgImage;

export function bgColor(color: string): string {
  return `linear-gradient(${color}, ${color})`;
}
