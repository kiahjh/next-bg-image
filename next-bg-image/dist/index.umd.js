(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react'), require('next/image')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react', 'next/image'], factory) :
  (global = global || self, factory(global.nextBgImage = {}, global.jsxRuntime, global.react, global.image));
})(this, (function (exports, jsxRuntime, react, image) {
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
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function getImageData(inputImages, lazyLoad) {
    var decls = [];
    var previousMax = -1;
    var largestImage = inputImages.filter(function (image) {
      return typeof image !== "string";
    }).reduce(function (acc, image) {
      return Math.max(acc, image.width);
    }, 0);
    var blurries = [];
    var images = inputImages.map(function (image$1) {
      var _imgProps$props$srcSe;
      if (typeof image$1 === "string") {
        blurries.push(image$1);
        return image$1;
      }
      var imgProps = image.unstable_getImgProps({
        src: image$1.src,
        alt: "",
        width: image$1.width,
        height: image$1.height
      });
      if (imgProps.props.srcSet === undefined) {
        return "url(" + image$1.src + ")";
      }
      var baseUrl = (_imgProps$props$srcSe = imgProps.props.srcSet.split(/\s/)[0]) == null ? void 0 : _imgProps$props$srcSe.split("&")[0];
      blurries.push("url(\"" + baseUrl + "&w=32&q=25\")");
      var imgQualityMap = IMG_SIZES.reduce(function (acc, size) {
        var _extends2;
        return _extends({}, acc, (_extends2 = {}, _extends2[size] = baseUrl + "&w=" + size + "&q=75", _extends2));
      }, {});
      return imgQualityMap;
    });
    for (var _iterator = _createForOfIteratorHelperLoose(IMG_SIZES.filter(function (size) {
        return size >= 384 && size < largestImage;
      })), _step; !(_step = _iterator()).done;) {
      var imageWidth = _step.value;
      var curDeclImages = [];
      for (var _iterator2 = _createForOfIteratorHelperLoose(images), _step2; !(_step2 = _iterator2()).done;) {
        var image$1 = _step2.value;
        if (typeof image$1 === "string") {
          curDeclImages.push({
            type: "gradient",
            value: image$1
          });
        } else {
          curDeclImages.push({
            type: "url",
            value: image$1[imageWidth]
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
      images: inputImages.map(function (image) {
        if (typeof image === "string") {
          return {
            type: "gradient",
            value: image
          };
        } else {
          return {
            type: "url",
            value: image.src
          };
        }
      })
    });
    return {
      decls: decls,
      blurry: lazyLoad ? blurries : undefined
    };
  }
  var IMG_SIZES = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  function generateMediaQuery(decl, id, lazyLoad, initialWindowWidth) {
    if (initialWindowWidth && decl.max < initialWindowWidth) return "";
    var selector = lazyLoad ? "." + id + ".loaded::after" : "." + id;
    var bgImageValue = decl.images.map(function (image) {
      return image.type === "url" ? "url(" + image.value + ")" : image.value;
    }).join(", ");
    if (decl.min === 0 && decl.max === Infinity) {
      return selector + " { background-image: " + bgImageValue + "; }";
    }
    switch (decl.max) {
      case Infinity:
        return "@media (min-width: " + decl.min + "px) { " + selector + " { background-image: " + bgImageValue + "; } }";
      default:
        return "@media (max-width: " + decl.max + "px) { " + selector + " { background-image: " + bgImageValue + "; } }";
    }
  }
  function lazyCss(blurry, id, position, size) {
    if (!blurry) return "";
    return "\n    ." + id + "::before {\n      background-image: " + blurry.join(", ") + ";\n    }\n    " + generateResponsiveRuleCSS("position", position, id, "::before") + "\n    " + generateResponsiveRuleCSS("size", size, id, "::before") + "\n    " + generateResponsiveRuleCSS("position", position, id, "::after") + "\n    " + generateResponsiveRuleCSS("size", size, id, "::after") + "\n";
  }
  function generateResponsiveRuleCSS(type, rule, id, pseudoSelector) {
    var selector = "." + id + (pseudoSelector != null ? pseudoSelector : "");
    if (typeof rule === "string") {
      return selector + " { background-" + type + ": " + rule + "; }";
    }
    return Object.entries(rule).reduce(function (acc, _ref) {
      var key = _ref[0],
        value = _ref[1];
      var number = sizeToNumber(key);
      if (!number) return acc;
      return acc + "\n@media (min-width: " + number + "px) { " + selector + " { background-" + type + ": " + value + "; } }";
    }, selector + " { background-" + type + ": " + rule["default"] + "; }");
  }
  function sizeToNumber(size) {
    switch (size) {
      case "sm":
        return 640;
      case "md":
        return 768;
      case "lg":
        return 1024;
      case "xl":
        return 1280;
      case "2xl":
        return 1536;
      default:
        if (isNaN(Number(size))) return null;
        return Number(size);
    }
  }

  function useIntersectionObserver(enabled, options) {
    var ref = react.useRef(null);
    var _useState = react.useState(false),
      intersected = _useState[0],
      setIntersected = _useState[1];
    var root = options.root,
      rootMargin = options.rootMargin,
      threshold = options.threshold;
    react.useEffect(function () {
      if (!enabled) return;
      var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          setIntersected(entry.isIntersecting);
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: root,
        rootMargin: rootMargin,
        threshold: threshold
      });
      if (ref.current) observer.observe(ref.current);
      var cur = ref.current;
      return function () {
        if (cur) observer.unobserve(cur);
      };
    }, [ref, root, rootMargin, threshold, enabled]);
    return {
      intersected: intersected,
      ref: ref
    };
  }

  var NextBackgroundImage = function NextBackgroundImage(_ref) {
    var srcProp = _ref.src,
      children = _ref.children,
      className = _ref.className,
      _ref$lazyLoad = _ref.lazyLoad,
      lazyLoad = _ref$lazyLoad === void 0 ? false : _ref$lazyLoad,
      _ref$lazyThreshold = _ref.lazyThreshold,
      lazyThreshold = _ref$lazyThreshold === void 0 ? 500 : _ref$lazyThreshold,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "cover" : _ref$size,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? "center" : _ref$position;
    var src = Array.isArray(srcProp) ? srcProp : [srcProp];
    var id = "__nbgi_" + react.useId().replace(/:/g, "");
    var _getImageData = getImageData(src, lazyLoad),
      decls = _getImageData.decls,
      blurry = _getImageData.blurry;
    var _useIntersectionObser = useIntersectionObserver(lazyLoad, {
        rootMargin: typeof lazyThreshold === "string" ? lazyThreshold : lazyThreshold + "px",
        threshold: 0
      }),
      intersected = _useIntersectionObser.intersected,
      ref = _useIntersectionObser.ref;
    var _useState = react.useState(false),
      imageLoaded = _useState[0],
      setImageLoaded = _useState[1];
    var _useState2 = react.useState(null),
      initialWindowWidth = _useState2[0],
      setInitialWindowWidth = _useState2[1];
    react.useEffect(function () {
      if (intersected) {
        var _decls$find;
        var imgs = (_decls$find = decls.find(function (decl) {
          return decl.min <= window.innerWidth && decl.max >= window.innerWidth;
        })) == null ? void 0 : _decls$find.images.filter(function (img) {
          return img.type === "url";
        });
        if (imgs) {
          var promise = Promise.all(imgs.map(function (_ref2) {
            var url = _ref2.value;
            return new Promise(function (resolve) {
              var img = new Image();
              img.onload = function () {
                return resolve(undefined);
              };
              img.onerror = function () {
                return resolve(undefined);
              };
              img.src = url;
            });
          }));
          promise.then(function () {
            return setImageLoaded(true);
          });
        }
      }
    }, [intersected, decls]);
    react.useEffect(function () {
      setInitialWindowWidth(window.innerWidth);
    }, []);
    return jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [jsxRuntime.jsx("style", {
        id: id + "_style",
        dangerouslySetInnerHTML: {
          __html: decls.reverse().map(function (decl) {
            return generateMediaQuery(decl, id, lazyLoad, initialWindowWidth);
          }).join("\n") + (lazyLoad ? lazyCss(blurry, id, position, size) : generateResponsiveRuleCSS("size", size, id) + generateResponsiveRuleCSS("position", position, id))
        }
      }), jsxRuntime.jsx("div", {
        ref: ref,
        style: {
          position: "relative"
        },
        className: id + " __nbgi_wrap" + (imageLoaded ? " loaded" : "") + (className ? " " + className : ""),
        children: children
      })]
    });
  };

  function bgColor(color) {
    return "linear-gradient(" + color + ", " + color + ")";
  }

  exports.bgColor = bgColor;
  exports["default"] = NextBackgroundImage;

}));
