import '../styles.css';
import ServiceWorker from '@components/ServiceWorker';
import Providers from '@components/Common/Providers';
import heyFont from '@lib/heyFont';
import type { AppProps } from 'next/app';
import { Suspense } from 'react';
import Loading from '@components/Shared/Loading';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Providers>
          <style jsx global>{`
            body {
              font-family: ${heyFont.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </Providers>
        <ServiceWorker />
      </Suspense>
    </>
  );
};

export default App;
