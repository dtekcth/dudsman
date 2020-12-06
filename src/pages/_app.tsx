import React from 'react';
import { GlobalStyles } from 'twin.macro';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { wrapper } from '../store';
import GameController from '../components/GameController';
import Head from 'next/head';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"
      />
    </Head>
    <CacheProvider value={cache}>
      <GlobalStyles />
      <Component {...pageProps} />
    </CacheProvider>

    <GameController />
  </>
);

export default wrapper.withRedux(App);
