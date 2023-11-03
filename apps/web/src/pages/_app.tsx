import '../styles.css';
import ServiceWorker from '@components/ServiceWorker';
import Providers from '@components/Common/Providers';
import heyFont from '@lib/heyFont';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <style jsx global>{`
        body {
          font-family: ${heyFont.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <ServiceWorker />
    </Providers>
  );
};

export default App;
