import Script from 'next/script';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps): React.ReactNode => (
  <div>
    <Script src="https://kit.fontawesome.com/597740db7b.js"></Script>
    <Component {...pageProps} />
  </div>
);

export default App;
