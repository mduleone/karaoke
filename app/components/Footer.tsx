'use client';

import styles from './Footer.module.scss';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import Link from 'next/link';

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
