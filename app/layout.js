import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from './layout.module.scss';

import './reset.scss';
import KaraokeSearchProvider from './context/karaoke';
import Header from './components/Header';
import SimpleUserProvider from './context/simple-user';
import Footer from './components/Footer';

export const metadata = {
	title: "Matt's Karaoke List",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={styles.body}>
				<SimpleUserProvider>
					<KaraokeSearchProvider>
						<Header />
						<main className={styles.main}>{children}</main>
						<Footer />
					</KaraokeSearchProvider>
				</SimpleUserProvider>
			</body>
		</html>
	);
}
