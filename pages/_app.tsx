import Layout from 'components/Layout';
import AmbianceProvider from 'contexts/ambiance';
import 'firebase/auth';
import 'firebase/firestore'; // <- needed if using firestore
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { METADATA } from '../constants';
import { AuthProvider } from '../contexts/auth';
import ScreenProvider from '../contexts/screen';
import '../styles/style.scss';

// const store = createStore(rootReducer);
// const rrfProps = {
//   firebase,
//   config: FIREBASE.RRF_CONFIG,
//   dispatch: store.dispatch,
//   createFirestoreInstance,
// };

function App({ Component, pageProps }: AppProps) {
  // <StoreProvider store={store}>
  //   <ReactReduxFirebaseProvider {...rrfProps}>
  //   </ReactReduxFirebaseProvider>
  // </StoreProvider>

  return (
    <AuthProvider>
      <AmbianceProvider>
        <ScreenProvider>
          <Head>
            <title>{METADATA.TITLE_SUFFIX}</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            ></meta>
          </Head>

          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ScreenProvider>
      </AmbianceProvider>
    </AuthProvider>
  );
}

export default App;
