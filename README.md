![Hero image for next-bg-image](./hero.png)

# Next Background Image

> A component that leverages the power of
> [`next/image`](https://nextjs.org/docs/app/api-reference/components/image) to provide
> responsive and optimized background images.

See working demos [here.](https://next-bg-image.kiahjh.com/demos)

## Installation:

```bash
# bun
bun install next-bg-image

# npm
npm install next-bg-image

# pnpm
pnpm install next-bg-image

# yarn
yarn add next-bg-image
```

## Features:

- **Automatic size optimization** - automatically generates an appropriately sized image
  to ensure that no image is rendered larger than it needs to be
- **Lazy loading** - images can be optionally lazy loaded to improve page performance
- **Multiple background images** - supports multiple background images (useful for
  overlays, semi-transparent images, gradients, etc.)
- **Responsive viewport resizing optimization** - `NextBgImage` will never request a
  smaller version of an image it has already loaded, but if you make the viewport larger
  it will load a larger version of the image to ensure the quality is as good as possible
- **TypeScript support out of the box** - written in TypeScript with full type support

## Requirements:

- Next.js 13.5.0 or newer

## Usage:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage src={SunsetImage}>
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

`NextBgImage` takes a `src` prop that is either a `StaticImageData` object or and array of
`StaticImageData` objects or strings (for gradients and overlays). The type looks like
this:

```ts
// src prop type:
StaticImageData | Array<StaticImageData | string>;
```

Note that `StaticImageData` is the type you get for free from Next.js when you import a
local image file. The type looks like this:

```ts
// StaticImageData type:
{
  src: string;
  height: number;
  width: number;
  // a few more optional entries
}
```

This means that if you have an image url but don't have the image locally available in
your project, then you can still use it with `NextBgImage` by constructing an object with
the `src`, `height`, and `width` properties. For example:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';

const MyComponent: React.FC = () => (
  <NextBgImage
    src={{
      src: 'https://example.com/images/sunset.jpg',
      height: 1080,
      width: 1920,
    }}
  >
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

In this case, the `src` should be an absolute url to the image, and the `width` and
`height` should be the width and height of the image in pixels. Note that this also works
when passing an array to the `src` prop.

For `NextBgImage` to work, at some point in your project you need to render the
`NextBgStaticCss` component. We recommend doing this in your root layout component, like
this:

```tsx
import React from 'react';
import { NextBgStaticCss } from 'next-bg-image';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <NextBgStaticCss />
    {children}
  </>
);

export default Layout;
```

### Gradients and overlays:

A common pattern in web development is to use a semi-transparent gradient or overlay
overtop a background image. This is super easy to do with `NextBgImage`:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage
    src={['radial-gradient(rgba(0 0 0 / 0.28), rgba(0 0 0 / 0.6) 65%)', SunsetImage]}
  >
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

Just use the exact same syntax you would use in CSS to apply a gradient as a background
image. As a shortcut for a single-color overlay, we also ship a `bgColor` utility function
that you can use like this:

```tsx
import React from 'react';
import NextBgImage, { bgColor } from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage src={[bgColor('rgb(0 0 0 / 0.28)'), SunsetImage]}>
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

### Passing multiple images:

HTML elements support
[multiple background images](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds),
so `NextBgImage` does too. Simply pass an array of `StaticImageData` objects or strings,
and those images will be applied as background images in the same order listed. This is
the same thing that was happening in the above examples with gradients and overlays, and
can be used with any combination of images, gradients, and overlays. For example:

```tsx
import React from 'react';
import NextBgImage, { bgColor } from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';
import LogoImage from '/images/brand/logo.png';

const MyComponent: React.FC = () => (
  <NextBgImage src={[bgColor('rgb(0 0 0 / 0.28)'), LogoImage, SunsetImage]}>
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

Note that the layers are listed top to bottom, so in thie example the dark overlay
(created with `bgColor`) is on top, then the logo, and underneath that is the sunset
image.

### Lazy loading:

By default, `NextBgImage` will try to load the appropriately sized image as soon as the
page loads. For background images that are in the viewport when the page loads, or are
part of critical components that should be prioritized, this is great. However, for
background images that are further down the page, or are not critical to the initial page
load, this will slow down the initial page load. To solve this, `NextBgImage` supports
lazy loading. To enable lazy loading, simply pass the `lazyLoad` prop:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage src={SunsetImage} lazyLoad>
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

When `lazyLoad` is `true`, `NextBgImage` will load a tiny (32px) version of the image as
soon as the page loads, but will wait to load the appropriately sized image until the
image gets close to the viewport. Once it loads the new image, it swaps them out with a
smooth animation that in most cases will never be seen. The distance from the viewport at
which the component will load the appropriately sized image is set to a default of 500px,
but can be configured with the `lazyThreshold` prop:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage src={SunsetImage} lazyLoad lazyThreshold={1000}>
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

Note that in most cases, the appropriately sized image is smaller than the full size of
the image, because unless the viewport is at least as wide as the image, there is no
reason to load a larger image.

### Custom size and position:

By default, the background image you pass to `NextBgImage` will be centered and cover the
entire element. If you want to change this, you can use the `size` and `position` props:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage src={SunsetImage} size="contain" position="bottom left">
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

This is great for most use cases; the `size` and `position` props accept any valid CSS.
But commonly you'll want to have custom positions and sizes for different screen sizes.
For this, you can pass on object like this:

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage
    src={SunsetImage}
    size={{
      base: 'cover',
      768: 'contain',
      1280: 'cover',
    }}
    position={{
      base: 'center',
      768: 'bottom left',
      1280: '20px -400px',
    }}
  >
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

These get translated into media queries, so in this example, the image will have a size of
`cover` and a position of `center` on screens smaller than 768px, a size of `contain` and
a position of `bottom left` on screens between 768px and 2048px, and a size of `cover` and
a position of `20px -400px` on screens larger than 2048px. You can use any number for the
keys, and it will correspond to a media query breakpoint. You can also use
[Tailwind's breakpoints](https://tailwindcss.com/docs/responsive-design):

```tsx
import React from 'react';
import NextBgImage from 'next-bg-image';
import SunsetImage from '/images/backgrounds/sunset.jpg';

const MyComponent: React.FC = () => (
  <NextBgImage
    src={SunsetImage}
    size={{
      base: 'cover',
      md: 'contain',
      xl: 'cover',
      2048: 'contain',
    }}
    position={{
      base: 'center',
      md: 'bottom left',
      xl: '20px -400px',
      2048: 'bottom right',
    }}
  >
    <h1>Hello, world!</h1>
    {/* more things... */}
  </NextBgImage>
);

export default MyComponent;
```

### Further customization:

- **Rendering as other html elements** - By default `NextBgImage` renders a `div` with the
  background image applied. If you want to render a different element, you can pass the
  `as` prop:

  ```tsx
  import React from 'react';
  import NextBgImage from 'next-bg-image';
  import SunsetImage from '/images/backgrounds/sunset.jpg';

  const MyComponent: React.FC = () => (
    <NextBgImage as="a" href="https://example.com" src={SunsetImage}>
      <h1>Hello, world!</h1>
      {/* more things... */}
    </NextBgImage>
  );

  export default MyComponent;
  ```

  All intrinsic props are passed through to the rendered element, so if you render with
  `as="a"`, you can pass `href`, `target`, etc. as props, but if you tried to pass those
  same props to the element with `as="footer"`, you would get a type error.

- **Passing intrinsic props** - All intrinsic props are passed through to the rendered
  element, so this means on any instance of `NextBgImage` you can always supply
  `className`, `style`, `id`, etc. Element-specific props are only available if used in
  conjunction with the `as` prop, as described above.

- **Defining a minimum image width** - By default, `NextBgImage` will not load an image
  that is larger than the viewport. This is great for performance, but sometimes you want
  the image loaded to have a width greater than the viewport. For example, if you have a
  `div` that is much taller than it is wide, you might want to load an image that is as
  wide as the `div` is tall. To do this, you can pass the `minImageWidth` prop:

  ```tsx
  import React from 'react';
  import NextBgImage from 'next-bg-image';
  import SunsetImage from '/images/backgrounds/sunset.jpg';

  const MyComponent: React.FC = () => (
    <NextBgImage src={SunsetImage} minImageWidth={1080}>
      <h1>Hello, world!</h1>
      {/* more things... */}
    </NextBgImage>
  );

  export default MyComponent;
  ```

  In this example, at screen sizes of less than 1080px, the image will still be loaded at
  1080px wide. Note that at larger screen sizes, the image will still be loaded at the
  appropriate size for the viewport (assuming the full-size image is larger than 1080px).

## Contributing:

Contributions are welcome and encouraged! Please open an issue or pull request.
