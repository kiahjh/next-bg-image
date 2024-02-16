import React from 'react';
import NextBgImage from '../../next-bg-image/src';
import Win from '../public/win.jpeg';

const TestPagesRouter: React.FC = () => (
  <div>
    <h1>Test Pages Router</h1>
    <NextBgImage src={Win} style={{ height: `100vh`, width: `100vw` }} eager />
  </div>
);

export default TestPagesRouter;
