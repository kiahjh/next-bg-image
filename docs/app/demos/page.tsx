import React from 'react';
import cx from 'classnames';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import NextBgImage, { bgColor } from 'next-bg-image';
import { spaceGrotesk } from '@/lib/fonts';

import FlowersImage from '@/public/flowers.jpg';

export const metadata = {
  title: `next-bg-image / demos`,
  description: `Demos for next-bg-image, a React component for responsive, optimized, and accessible background images within Next.js projects.`,
};

const DemoPage: React.FC = () => (
  <main className="xl:px-12 py-12 flex flex-col gap-12 sm:bg-slate-50">
    <Demo
      title="Basic use case"
      description="The most common use case, with a single image and a centered content, requires no configuration."
      code={`
import NextBgImage from "next-bg-image";

const MyComponent: React.FC = () => (
  <NextBgImage src={FlowersImage} className="flex flex-col justify-end p-4">
    <div className="bg-white/80 backdrop-blur p-8 rounded-2xl">
      <h1 className="text-3xl font-bold mb-2">Lorem ipsum</h1>
      <p className="text-slate-600">
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
        cillum sint consectetur cupidatat.
      </p>
    </div>
  </NextBgImage>
);

export default MyComponent;
     `}
    >
      <NextBgImage src={FlowersImage} className="flex flex-col justify-end p-4">
        <div className="bg-white/80 backdrop-blur p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-2">Lorem ipsum</h1>
          <p className="text-slate-600">
            Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum
            sint consectetur cupidatat.
          </p>
        </div>
      </NextBgImage>
    </Demo>
    <Demo
      title="Color overlay"
      description="A common pattern is to add a color overlay to the image, to make the text more readable. `next-bg-image` supports this with the `bgColor` utility function."
      code={`
import NextBgImage, { bgColor } from "next-bg-image";

const MyComponent: React.FC = () => (
  <NextBgImage
    src={[bgColor("#0d2eb8ba"), FlowersImage]}
    className="flex flex-col justify-center items-center px-12"
  >
    <h1 className="text-3xl font-bold mb-2 text-white">Lorem ipsum</h1>
    <p className="text-white/80 text-center">
      Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
      cillum sint consectetur cupidatat.
    </p>
  </NextBgImage>
);

export default MyComponent;
     `}
    >
      <NextBgImage
        src={[bgColor(`#0d2eb8ba`), FlowersImage]}
        className="flex flex-col justify-center items-center px-12"
      >
        <h1 className="text-3xl font-bold mb-2 text-white">Lorem ipsum</h1>
        <p className="text-white/80 text-center">
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint
          consectetur cupidatat.
        </p>
      </NextBgImage>
    </Demo>
    <Demo
      title="Gradient overlay"
      description="Another way to make text or other content more readable is to add a gradient overlay. `next-bg-image` supports this by accepting an array of images, which are layered on top of each other."
      code={`
import NextBgImage from "next-bg-image";

const MyComponent: React.FC = () => (
  <NextBgImage
    src={[
      "radial-gradient(#000000ee 20%, #000000aa 60%, transparent 120%)",
      FlowersImage,
    ]}
    className="flex flex-col justify-center items-center px-12"
  >
    <h1 className="text-3xl font-bold mb-2 text-white">Lorem ipsum</h1>
    <p className="text-white/80 text-center">
      Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
      cillum sint consectetur cupidatat.
    </p>
  </NextBgImage>
);

export default MyComponent;
     `}
    >
      <NextBgImage
        src={[
          `radial-gradient(#000000ee 20%, #000000aa 60%, transparent 120%)`,
          FlowersImage,
        ]}
        className="flex flex-col justify-center items-center px-12"
      >
        <h1 className="text-3xl font-bold mb-2 text-white">Lorem ipsum</h1>
        <p className="text-white/80 text-center">
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint
          consectetur cupidatat.
        </p>
      </NextBgImage>
    </Demo>
    <Demo
      title="Custom background size/position"
      description="By default, `next-bg-image` will use `cover` for the `background-size` property, and `center` for the `background-position` property. You can override these values with the `size` and `position` props. These can also be responsive objects, which will be applied at the specified breakpoints."
      code={`
import NextBgImage from "next-bg-image";

const MyComponent: React.FC = () => (
  <NextBgImage
    src={FlowersImage}
    position={{
      base: "-400px 0px",
      sm: "-300px 0px",
      md: "-100px 0px",
      lg: "-330px 120px",
      xl: "-300px 100px",
    }}
    size={{ base: "1100px", lg: "220%", xl: "200%" }}
    className="flex"
  >
    <div className="bg-white/40 backdrop-blur p-8 w-[300px]">
      <h1 className="text-3xl font-bold mb-2 text-black">Lorem ipsum</h1>
      <p className="text-slate-500">
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
        cillum sint consectetur cupidatat.
      </p>
    </div>
  </NextBgImage>
);

export default MyComponent;
     `}
    >
      <NextBgImage
        src={FlowersImage}
        position={{
          base: `-400px 0px`,
          sm: `-300px 0px`,
          md: `-100px 0px`,
          lg: `-330px 120px`,
          xl: `-300px 100px`,
        }}
        size={{ base: `1100px`, lg: `220%`, xl: `200%` }}
        className="flex"
      >
        <div className="bg-white/40 backdrop-blur p-8 w-[300px]">
          <h1 className="text-3xl font-bold mb-2 text-black">Lorem ipsum</h1>
          <p className="text-slate-500">
            Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum
            sint consectetur cupidatat.
          </p>
        </div>
      </NextBgImage>
    </Demo>
  </main>
);

export default DemoPage;

interface DemoProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

const Demo: React.FC<DemoProps> = ({ title, description, code, children }) => (
  <div className="flex flex-col bg-white p-6 sm:p-8 md:p-12 rounded-3xl">
    <div className="flex flex-col">
      <h2 className={cx(`font-bold text-4xl text-blue-950`, spaceGrotesk)}>{title}</h2>
      <p
        className="text-lg sm:text-xl text-blue-900/60 mt-4 mb-8 max-w-5xl"
        dangerouslySetInnerHTML={{
          __html: description
            .replaceAll(
              ` \``,
              ` <code style="background:#e2e8f0;padding:2px 6px;border-radius:8px;font-size:18px">`,
            )
            .replaceAll(`\` `, `</code> `),
        }}
      />
    </div>
    <div className="flex flex-col-reverse lg:flex-row gap-8 xl:gap-12">
      <SyntaxHighlighter
        language="typescript"
        style={atomOneDark}
        className="rounded-2xl overflow-scroll !py-4 !bg-slate-900 flex-grow !my-0"
        children={code.trim()}
        showLineNumbers
      />

      <div className="h-[400px] lg:h-auto lg:w-[500px] xl:w-[600px] overflow-hidden rounded-2xl shrink-0 [&>*]:h-full [&>*]:w-full">
        {children}
      </div>
    </div>
  </div>
);
