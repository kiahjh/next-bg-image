import { Space_Grotesk } from 'next/font/google';

const spaceGroteskFont = Space_Grotesk({
  subsets: ['latin'], // eslint-disable-line
});

export const spaceGrotesk = spaceGroteskFont.className;
