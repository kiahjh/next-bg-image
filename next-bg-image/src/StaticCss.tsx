import React from 'react';

const StaticCss: React.FC = () => (
  <style id="__nbgi_static" dangerouslySetInnerHTML={{ __html: STATIC_CSS }} />
);

export default StaticCss;

const STATIC_CSS = `
.__nbgi_wrap::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 100%;
  z-index: -1001;
  filter: blur(3px);
}

.__nbgi_wrap.loaded::before {
  filter: none;
}

.__nbgi_wrap::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 100%;
  z-index: -1000;
  opacity: 0;
  transition: 250ms opacity ease-out;
}

.__nbgi_wrap.loaded::after {
  opacity: 100%;
}

.__nbgi_wrap {
  z-index: 0;
}
`;
