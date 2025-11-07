import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from './layout.module.scss';

import './reset.scss';
import KaraokeSearchProvider from './context/karaoke';
import Header from './components/Header';
import SimpleUserProvider from './context/simple-user';
import Footer from './components/Footer';
import ToastProvider from './components/ToastProvider';
import { Nunito } from 'next/font/google';
import cx from './utils/classnames';
import SetDynamicManifestUrl from './components/SetDynamicManifest';

export const metadata = {
  title: "MyKaraoke",
};

const nunito = Nunito({
  subsets: ['latin']
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="myKaraoke" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
      </head>
      <body className={cx(styles.body, nunito.className)}>
        <SetDynamicManifestUrl />
        <SimpleUserProvider>
          <KaraokeSearchProvider>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
          </KaraokeSearchProvider>
        </SimpleUserProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
