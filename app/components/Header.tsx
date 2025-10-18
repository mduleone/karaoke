'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import { useState } from 'react';

import AddSongButton from './AddSongButton';
import SimpleUserForm from './SimpleUserForm';
import styles from './Header.module.scss';
import '../utils/font-awesome';
import { useSimpleUserContext } from '../context/simple-user';

config.autoAddCss = false;

const Header = () => {
	const { username, pin } = useSimpleUserContext();
	const [showUserForm, setShowUserForm] = useState(false);

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
						<button
							type="button"
							className={styles.userIconButton}
							title="Set Username/Pin"
							onClick={() => setShowUserForm(!showUserForm)}
						>
							<FontAwesomeIcon icon={['fas', 'user']} />
						</button>
						{showUserForm && <SimpleUserForm onClose={() => setShowUserForm(false)} />}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
