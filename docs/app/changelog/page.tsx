import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import type { NextPage } from 'next';
import { spaceGrotesk } from '@/lib/fonts';

export const metadata = {
  title: `next-bg-image / changelog`,
  description: `Changelog for next-bg-image, a React component for responsive, optimized, and accessible background images within Next.js projects.`,
};

const Changelog: NextPage = () => (
  <div className="flex flex-col items-center py-12 sm:py-20 px-4 xs:px-8 sm:px-12 min-h-[calc(100vh-128px)] bg-slate-50">
    <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900">Changelog</h1>
    <div className="w-full max-w-2xl flex flex-col mt-12 gap-8">
      <Update
        version="0.2.0"
        date="January 23, 2024"
        features={[
          {
            text: `support for Next.js 14.1`,
            to: `https://nextjs.org/blog/next-14-1`,
          },
          {
            text: `eager loading`,
            to: `https://github.com/kiahjh/next-bg-image?tab=readme-ov-file#eager-loading`,
          },
          {
            text: `demo page`,
            to: `/demos`,
          },
        ]}
      >
        <p>
          In Next.js 14.1, <code>getImageProps</code> is now stable, and we now support it
          while remaining backwards compatible with older versions of Next.js (back to
          13.5 when they first introduced <code>unstable_getImgProps</code>).
        </p>
        <p>
          We introduced a new prop, <code>eager</code>, which allows you to opt into
          prioritized loading for important images.
        </p>
        <p>
          We've also added a <Link href="/demos">demo page</Link> to showcase the various
          features of the component.
        </p>
      </Update>
      <Update
        version="0.1.0"
        date="January 9, 2024"
        features={[
          {
            text: `automatic size optimization`,
            to: `https://github.com/kiahjh/next-bg-image?tab=readme-ov-file#features`,
          },
          {
            text: `lazy loading`,
            to: `https://github.com/kiahjh/next-bg-image?tab=readme-ov-file#lazy-loading`,
          },
          {
            text: `multiple background images`,
            to: `https://github.com/kiahjh/next-bg-image?tab=readme-ov-file#passing-multiple-images`,
          },
          {
            text: `responsive viewport resizing optimization`,
            to: `https://github.com/kiahjh/next-bg-image?tab=readme-ov-file#features`,
          },
          {
            text: `gradient support`,
            to: `https://github.com/kiahjh/next-bg-image?tab=readme-ov-file#gradients-and-overlays`,
          },
        ]}
      >
        <p>
          We're out of beta! The component is now stable for use in production, but as
          this is a pre-1.0.0 release, expect lots of changes in upcoming updates. Read
          the full documentation{` `}
          <Link href="https://github.com/kiahjh/next-bg-image/blob/master/README.md">
            here
          </Link>
          .
        </p>
      </Update>
    </div>
  </div>
);

export default Changelog;

interface UpdateProps {
  version: string;
  date: string;
  features: Array<{
    text: string;
    to: string;
  }>;
  children: React.ReactNode;
}

const Update: React.FC<UpdateProps> = ({ version, date, children, features }) => (
  <div className="bg-white p-6 xs:p-8 rounded-2xl shadow-md shadow-slate-500/10">
    <h3 className="text-blue-400 text-lg font-medium">{date}</h3>
    <h2 className={cx(`font-bold text-3xl text-slate-800`, spaceGrotesk)}>{version}</h2>
    <div className="text-slate-400 mt-2 flex gap-2 flex-wrap">
      {features.map((feature) => (
        <Link
          key={feature.text}
          href={feature.to}
          className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-100 text-blue-500 hover:text-blue-600 px-2 rounded-lg font-medium"
        >
          {feature.text}
        </Link>
      ))}
    </div>
    <div className="mt-8 text-slate-500 flex flex-col gap-3 [&_code]:bg-pink-100 [&_code]:text-pink-500 [&_code]:text-[0.95rem] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-lg [&_a]:text-blue-500">
      {children}
    </div>
  </div>
);
