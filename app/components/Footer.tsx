'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';

import styles from './Footer.module.scss';
import '../utils/font-awesome';
import Link from 'next/link';

config.autoAddCss = false;

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<p>
				Made with <FontAwesomeIcon style={{ color: '#cc0001' }} icon={['fas', 'heart']} /> by{' '}
				<Link href="https://matt.dule.one/" target="_blank">
					Matt
				</Link>{' '}
				© {new Date().getFullYear()}
			</p>
		</footer>
	);
};

export default Footer;
