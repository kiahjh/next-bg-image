import React from 'react';

const StaticCss: React.FC = () => (
  <style id="__nbgi_static" dangerouslySetInnerHTML={{ __html: STATIC_CSS }} />
);

export default StaticCss;

const STATIC_CSS = `
.__nbgi_lazy {
  position: relative;
  z-index: 0;
}

.__nbgi_lazy::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 100%;
  z-index: -1001;
}

.__nbgi_lazy:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 100%;
  z-index: -1000;
  opacity: 0;
  transition: 200ms opacity ease-out;
}

.__nbgi_loaded::after {
  opacity: 100%;
}
`;
