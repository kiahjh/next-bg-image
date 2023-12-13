import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useRef, useState, useEffect, useId } from 'react';
import { unstable_getImgProps } from 'next/image';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function getImageData(inputImages, lazyLoad) {
  const decls = [];
  let previousMax = -1;
  const largestImage = inputImages.filter(image => typeof image !== `string`).reduce((acc, image) => Math.max(acc, image.width), 0);
  const blurries = [];
  const images = inputImages.map(image => {
    var _imgProps$props$srcSe;
    if (typeof image === `string`) {
      blurries.push(image);
      return image;
    }
    const imgProps = unstable_getImgProps({
      src: image.src,
      alt: ``,
      width: image.width,
      height: image.height
    });
    if (imgProps.props.srcSet === undefined) {
      return `url(${image.src})`;
    }
    const baseUrl = (_imgProps$props$srcSe = imgProps.props.srcSet.split(/\s/)[0]) == null ? void 0 : _imgProps$props$srcSe.split(`&`)[0];
    blurries.push(`url("${baseUrl}&w=32&q=25")`);
    const imgQualityMap = IMG_SIZES.reduce((acc, size) => _extends({}, acc, {
      [size]: `${baseUrl}&w=${size}&q=75`
    }), {});
    return imgQualityMap;
  });
  for (const imageWidth of IMG_SIZES.filter(size => size >= 384 && size < largestImage)) {
    const curDeclImages = [];
    for (const image of images) {
      if (typeof image === `string`) {
        curDeclImages.push({
          type: `gradient`,
          value: image
        });
      } else {
        curDeclImages.push({
          type: `url`,
          value: image[imageWidth]
        });
      }
    }
    decls.push({
      images: curDeclImages,
      min: previousMax + 1,
      max: imageWidth
    });
    previousMax = imageWidth;
  }
  decls.push({
    min: previousMax + 1,
    max: Infinity,
    images: inputImages.map(image => {
      if (typeof image === `string`) {
        return {
          type: `gradient`,
          value: image
        };
      } else {
        return {
          type: `url`,
          value: image.src
        };
      }
    })
  });
  return {
    decls,
    blurry: lazyLoad ? blurries : undefined
  };
}
const IMG_SIZES = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
function generateMediaQuery(decl, id, lazyLoad, initialWindowWidth) {
  if (initialWindowWidth && decl.max < initialWindowWidth) return ``;
  const selector = lazyLoad ? `.${id}.loaded::after` : `.${id}`;
  const bgImageValue = decl.images.map(image => image.type === `url` ? `url(${image.value})` : image.value).join(`, `);
  if (decl.min === 0 && decl.max === Infinity) {
    return `${selector} { background-image: ${bgImageValue}; }`;
  }
  switch (decl.max) {
    case Infinity:
      return `@media (min-width: ${decl.min}px) { ${selector} { background-image: ${bgImageValue}; } }`;
    default:
      return `@media (max-width: ${decl.max}px) { ${selector} { background-image: ${bgImageValue}; } }`;
  }
}
function lazyCss(blurry, id, position, size) {
  if (!blurry) return ``;
  return `
    .${id}::before {
      background-image: ${blurry.join(`, `)};
    }
    ${generateResponsiveRuleCSS(`position`, position, id, `::before`)}
    ${generateResponsiveRuleCSS(`size`, size, id, `::before`)}
    ${generateResponsiveRuleCSS(`position`, position, id, `::after`)}
    ${generateResponsiveRuleCSS(`size`, size, id, `::after`)}
`;
}
function generateResponsiveRuleCSS(type, rule, id, pseudoSelector) {
  const selector = `.${id}${pseudoSelector != null ? pseudoSelector : ``}`;
  if (typeof rule === `string`) {
    return `${selector} { background-${type}: ${rule}; }`;
  }
  return Object.entries(rule).reduce((acc, [key, value]) => {
    const number = sizeToNumber(key);
    if (!number) return acc;
    return `${acc}\n@media (min-width: ${number}px) { ${selector} { background-${type}: ${value}; } }`;
  }, `${selector} { background-${type}: ${rule.default}; }`);
}
function sizeToNumber(size) {
  switch (size) {
    case `sm`:
      return 640;
    case `md`:
      return 768;
    case `lg`:
      return 1024;
    case `xl`:
      return 1280;
    case `2xl`:
      return 1536;
    default:
      if (isNaN(Number(size))) return null;
      return Number(size);
  }
}

function useIntersectionObserver(enabled, options) {
  const ref = useRef(null);
  const [intersected, setIntersected] = useState(false);
  const {
    root,
    rootMargin,
    threshold
  } = options;
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        setIntersected(entry.isIntersecting);
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    }, {
      root,
      rootMargin,
      threshold
    });
    if (ref.current) observer.observe(ref.current);
    const cur = ref.current;
    return () => {
      if (cur) observer.unobserve(cur);
    };
  }, [ref, root, rootMargin, threshold, enabled]);
  return {
    intersected,
    ref
  };
}

const NextBackgroundImage = ({
  src: srcProp,
  children,
  className,
  lazyLoad: _lazyLoad = false,
  lazyThreshold: _lazyThreshold = 500,
  size: _size = `cover`,
  position: _position = `center`
}) => {
  const src = Array.isArray(srcProp) ? srcProp : [srcProp];
  const id = `__nbgi_` + useId().replace(/:/g, ``);
  const {
    decls,
    blurry
  } = getImageData(src, _lazyLoad);
  const {
    intersected,
    ref
  } = useIntersectionObserver(_lazyLoad, {
    rootMargin: typeof _lazyThreshold === `string` ? _lazyThreshold : `${_lazyThreshold}px`,
    threshold: 0
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [initialWindowWidth, setInitialWindowWidth] = useState(null);
  useEffect(() => {
    if (intersected) {
      var _decls$find;
      const imgs = (_decls$find = decls.find(decl => decl.min <= window.innerWidth && decl.max >= window.innerWidth)) == null ? void 0 : _decls$find.images.filter(img => img.type === `url`);
      if (imgs) {
        const promise = Promise.all(imgs.map(({
          value: url
        }) => new Promise(resolve => {
          const img = new Image();
          img.onload = () => resolve(undefined);
          img.onerror = () => resolve(undefined);
          img.src = url;
        })));
        promise.then(() => setImageLoaded(true));
      }
    }
  }, [intersected, decls]);
  useEffect(() => {
    setInitialWindowWidth(window.innerWidth);
  }, []);
  return jsxs(Fragment, {
    children: [jsx("style", {
      id: `${id}_style`,
      dangerouslySetInnerHTML: {
        __html: decls.reverse().map(decl => generateMediaQuery(decl, id, _lazyLoad, initialWindowWidth)).join(`\n`) + (_lazyLoad ? lazyCss(blurry, id, _position, _size) : generateResponsiveRuleCSS(`size`, _size, id) + generateResponsiveRuleCSS(`position`, _position, id))
      }
    }), jsx("div", {
      ref: ref,
      style: {
        position: `relative`
      },
      className: `${id} __nbgi_wrap${imageLoaded ? ` loaded` : ``}${className ? ` ${className}` : ``}`,
      children: children
    })]
  });
};

function bgColor(color) {
  return `linear-gradient(${color}, ${color})`;
}

export { bgColor, NextBackgroundImage as default };
