/* eslint-disable react-hooks/rules-of-hooks */
import { apolloClient, ApolloProvider } from '@lensshare/lens/apollo';
import authLink from '@lib/authLink';
import { Analytics } from '@vercel/analytics/react';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import {
  createReactClient,
  LivepeerConfig,
  studioProvider
} from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import LensSubscriptionsProvider from './LensSubscriptionsProvider';
import PreferencesProvider from './PreferencesProvider';
import Web3Provider from './Web3Provider';
import { LENSTOK_URL } from '@lensshare/data/constants';
import LeafwatchProvider from './LeafwatchProvider';
import SW from '@components/ServiceWorker';
import FeatureFlagsProvider from './FeatureFlagsProvider';
import ProProvider from './ProProvider';

const lensApolloClient = apolloClient(authLink);
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: '9e17a7ab-3370-4e31-85c3-43072da2315e' || '',
    baseUrl: LENSTOK_URL
  })
});
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <SW />
      <LeafwatchProvider />
      <Web3Provider>
        <ApolloProvider client={lensApolloClient}>
          <LensSubscriptionsProvider />
          <QueryClientProvider client={queryClient}>
            <PreferencesProvider />
            <FeatureFlagsProvider />
            <ProProvider />
            <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
              <ThemeProvider defaultTheme="light" attribute="class">
                <Layout>{children}</Layout>
              </ThemeProvider>
              <Analytics />
            </LivepeerConfig>
          </QueryClientProvider>
        </ApolloProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default Providers;
