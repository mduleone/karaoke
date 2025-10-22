'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import AddSongButton from './AddSongButton';
import SimpleUserForm from './SimpleUserForm';
import styles from './Header.module.scss';
import '../utils/font-awesome';
import { useSimpleUserContext } from '../context/simple-user';

config.autoAddCss = false;

const Header = () => {
	const { username, pin } = useSimpleUserContext();
	const [showUserForm, setShowUserForm] = useState(false);
	const params = useParams();
	const pathname = usePathname();

	const onCloseUserForm = useCallback(() => {
		setShowUserForm(false);
	}, []);

	const isMatt = params.username === 'matt' || typeof params.username === 'undefined';
	const isHistory = pathname.endsWith('/history');
	const historyHref = `/${isMatt ? 'matt' : params.username}/history`;
	const songListHref = `/${isMatt ? '' : params.username}`;

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<ul className={styles.navList}>
					<li className={styles.leftNavItem}>
						<Link href="/" className={styles.navLink}>
							myKaraokeList
						</Link>
					</li>
					{username && pin && (
						<li>
							<AddSongButton className={styles.navLink} />
						</li>
					)}
					<li className={styles.userIcon}>
						<Link className={styles.userIconButton} href={isHistory ? songListHref : historyHref}>
							<FontAwesomeIcon icon={['fas', 'clock-rotate-left']} />
						</Link>
					</li>
					<li className={styles.userIcon}>
						<button
							type="button"
							className={styles.userIconButton}
							title="Set Username/Pin"
							onClick={() => setShowUserForm(!showUserForm)}
						>
							<FontAwesomeIcon icon={['fas', 'user']} />
						</button>
						{showUserForm && <SimpleUserForm onClose={onCloseUserForm} />}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
