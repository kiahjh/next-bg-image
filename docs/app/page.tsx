import cx from 'classnames';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { NextPage } from 'next';
import { spaceGrotesk } from '@/lib/fonts';

export const metadata = {
  title: `next-bg-image`,
  description: `Responsive, optimized, and accessible background images for Next.js.`,
};

const Home: NextPage = () => (
  <main className="flex flex-col min-h-[calc(100vh-88px)] bg-gradient-to-b from-white to-blue-100">
    <div className="flex-grow flex justify-center items-center flex-col p-8 md:p-20">
      <h1
        className={cx(
          `text-4xl md:text-5xl xl:text-6xl max-w-[1100px] text-center !leading-[1.8em] text-blue-900/60`,
        )}
      >
        <span
          className={cx(
            `font-bold bg-gradient-to-r from-blue-950 via-blue-400 to-blue-800 bg-clip-text text-transparent text-5xl xs:text-6xl md:text-7xl xl:text-8xl`,
            spaceGrotesk,
          )}
        >
          Responsive,
        </span>
        {` `}
        <span
          className={cx(
            `font-bold bg-gradient-to-r from-violet-950 via-violet-400 to-violet-800 bg-clip-text text-transparent text-5xl xs:text-6xl md:text-7xl xl:text-8xl`,
            spaceGrotesk,
          )}
        >
          optimized,
        </span>
        {` `}
        and{` `}
        <span
          className={cx(
            `font-bold bg-gradient-to-r from-pink-950 via-pink-400 to-pink-800 bg-clip-text text-transparent text-5xl xs:text-6xl md:text-7xl xl:text-8xl`,
            spaceGrotesk,
          )}
        >
          accessible
        </span>
        {` `}
        background images for Next.js
      </h1>
      <Link
        href="/demos"
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-400 px-8 md:px-12 py-4 md:py-6 rounded-full text-2xl lg:text-3xl font-medium text-white mt-12 group"
      >
        See examples
        <ArrowRight className="group-hover:translate-x-4 transition-transform duration-300" />
      </Link>
    </div>
    <footer className="flex justify-center items-center p-4 text-blue-900/40">
      <span>
        Made by {` `}
        <Link
          href="https://github.com/jaredh159"
          className="font-medium text-blue-900/70"
        >
          @jaredh159
        </Link>
        {` `}and{` `}
        <Link href="https://github.com/kiahjh" className="font-medium text-blue-900/70">
          @kiahjh
        </Link>
      </span>
    </footer>
  </main>
);

export default Home;
