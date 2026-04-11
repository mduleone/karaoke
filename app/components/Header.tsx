'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import AddSongButton from './AddSongButton';
import SimpleUserForm from './SimpleUserForm';
import styles from './Header.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import { FontAwesomeIcon } from './FontAwesomeProvider';

const Header = () => {
  const { username, pin } = useSimpleUserContext();
  const [showUserForm, setShowUserForm] = useState(false);
  const params = useParams();
  const pathname = usePathname();

  const userButtonRef = useRef<HTMLButtonElement>(null);

  const onCloseUserForm = useCallback(() => {
    setShowUserForm(false);
  }, []);

  if (pathname === '/') return null;

  const isHistory = pathname.endsWith('/history');
  const historyHref = `/${params.username}/history`;
  const songListHref = `/${params.username}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.leftNavItem}>
            <Link href="/" className={styles.navLink}>
              myKaraoke
            </Link>
          </li>
          {username && pin && username === params.username && (
            <li>
              <AddSongButton className={styles.navLink} />
            </li>
          )}
          <li className={styles.userIcon}>
            <Link aria-label={isHistory ? 'Song list' : 'Singing history'} className={styles.userIconButton} href={isHistory ? songListHref : historyHref}>
              <FontAwesomeIcon icon={['fas', 'list-ol']} />
            </Link>
          </li>
          <li className={styles.userIcon}>
            <button
              ref={userButtonRef}
              type="button"
              aria-label="Account"
              className={styles.userIconButton}
              onClick={() => setShowUserForm(!showUserForm)}
            >
              <FontAwesomeIcon icon={['fas', 'user']} />
            </button>
            {showUserForm && <SimpleUserForm onClose={onCloseUserForm} triggerRef={userButtonRef} />}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
