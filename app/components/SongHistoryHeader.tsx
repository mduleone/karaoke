'use client';

import { useParams } from 'next/navigation';
import { useRef } from 'react';

import { useKaraokeSearchContext } from '../context/karaoke';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import styles from './SongHistoryHeader.module.scss';
import cx from '../utils/classnames';

const SongHistoryHeader = () => {
  const { username: paramsUsername } = useParams() as { username?: string };
  const displayUsername = paramsUsername && paramsUsername.charAt(0).toLocaleUpperCase() + paramsUsername.slice(1);

  const { historySearchQuery, setHistorySearchQuery } = useKaraokeSearchContext();
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.heading}>
      <h2>{displayUsername}&rsquo;s History</h2>
      <label htmlFor="history-search" className={styles.searchLabel}>
        <input
          id="history-search"
          type="text"
          onChange={(e) => setHistorySearchQuery(e.target.value)}
          value={historySearchQuery}
          name="search"
          placeholder="Song or Artist Search..."
          className={styles.searchBox}
          ref={searchRef}
        />
        <button
          type="button"
          onClick={() => {
            setHistorySearchQuery('');
            searchRef.current?.focus();
          }}
          className={cx(styles.clearSearchButton, { [styles.show]: historySearchQuery.length > 0 })}
        >
          <FontAwesomeIcon icon={['fas', 'xmark']} />
        </button>
      </label>
    </div>
  );
};

export default SongHistoryHeader;
