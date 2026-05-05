'use client';

import { useParams } from 'next/navigation';
import { useRef } from 'react';

import { useKaraokeSearchContext } from '../context/karaoke';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import styles from './SongListFilters.module.scss';
import { slugToString } from '../utils/string';
import cx from '../utils/classnames';

type Props = {
  filteredCount?: number;
  totalCount?: number;
};

const SongListFilters = ({ filteredCount, totalCount }: Props) => {
  const { username: paramsUsername } = useParams() as { username?: string };
  const stringName = slugToString(paramsUsername);
  const displayUsername = stringName && stringName.charAt(0).toLocaleUpperCase() + stringName.slice(1);

  const {
    searchQuery,
    showAvoid,
    favoritesOnly,
    duetsOnly,
    byRecentlyAdded,
    byTitle,
    setSearchQuery,
    setShowAvoid,
    setFavoritesOnly,
    setDuetsOnly,
    setByRecentlyAdded,
    setByTitle,
  } = useKaraokeSearchContext();

  const searchRef = useRef<HTMLInputElement>(null);
  const loading = filteredCount === undefined || totalCount === undefined;

  return (
    <div className={styles.filters}>
      <h2>{displayUsername}&rsquo;s List</h2>
      <label htmlFor="search" className={styles.searchLabel}>
        <input
          id="search"
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          name="search"
          placeholder="Song or Artist Search..."
          className={styles.searchBox}
          ref={searchRef}
          autoCapitalize="words"
        />
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            if (searchRef.current) {
              searchRef.current.focus();
            }
          }}
          aria-label="Clear Search"
          disabled={searchQuery.length === 0}
          className={cx(styles.clearSearchButton, { [styles.show]: searchQuery.length > 0 })}
        >
          <FontAwesomeIcon icon={['fas', 'x']} widthAuto />
        </button>
      </label>
      <div className={styles.settingsPanel}>
        <button
          type="button"
          onClick={() => setFavoritesOnly((p) => !p)}
          aria-label={`Show ${favoritesOnly ? 'all songs' : 'favorites only'}`}
          className={cx(styles.settingsButton, styles.standAlone, { [styles.enabled]: favoritesOnly })}
        >
          <FontAwesomeIcon icon={['fas', 'heart']} />
        </button>
        <button
          type="button"
          onClick={() => setDuetsOnly((p) => !p)}
          aria-label={`Show ${duetsOnly ? 'all songs' : 'duets only'}`}
          className={cx(styles.settingsButton, styles.noGap, { [styles.enabled]: duetsOnly })}
        >
          <FontAwesomeIcon widthAuto icon={['fas', 'user-plus']} />
          <FontAwesomeIcon widthAuto icon={['fas', 'user']} />
        </button>
        <button
          type="button"
          onClick={() => setShowAvoid((p) => !p)}
          aria-label={`${showAvoid ? 'Hide' : 'Show'} avoided songs`}
          className={cx(styles.settingsButton, { [styles.enabled]: !showAvoid })}
        >
          Hide <FontAwesomeIcon icon={['fas', 'microphone-lines-slash']} />
        </button>
        <button
          type="button"
          onClick={() => setByTitle(!byTitle)}
          aria-label={`Sort by ${byTitle ? 'Artist' : 'Title'}`}
          className={cx(styles.settingsButton, { [styles.enabled]: byTitle })}
        >
          By Title
        </button>
        <button
          type="button"
          onClick={() => setByRecentlyAdded(!byRecentlyAdded)}
          aria-label={`Sort ${byRecentlyAdded ? 'by Recently Added' : 'Artist and Song'}`}
          className={cx(styles.settingsButton, styles.standAlone, { [styles.enabled]: byRecentlyAdded })}
        >
          <FontAwesomeIcon icon={['fas', 'clock-rotate-left']} />
        </button>
      </div>
      <div className={styles.displayCount}>
        {loading ? (
          <span className={styles.skeletonCount} aria-label="Loading songs" />
        ) : (
          <span>
            {filteredCount < totalCount ? `${filteredCount} of ${totalCount}` : `All ${totalCount}`} Songs
          </span>
        )}
        {(favoritesOnly || duetsOnly || byRecentlyAdded) && (
          <span className={styles.activeFilters}>
            {favoritesOnly && (
              <span className={cx(styles.activeFilter, styles.activeFilterFavorite)}>
                <FontAwesomeIcon icon={['fas', 'heart']} />
              </span>
            )}
            {duetsOnly && (
              <span className={cx(styles.activeFilter, styles.activeFilterDuet)}>
                <FontAwesomeIcon widthAuto icon={['fas', 'user-plus']} />
                <FontAwesomeIcon widthAuto icon={['fas', 'user']} />
              </span>
            )}
            {byRecentlyAdded && (
              <span className={cx(styles.activeFilter, styles.activeFilterRecent)}>
                <FontAwesomeIcon icon={['fas', 'clock-rotate-left']} />
                Recent
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default SongListFilters;
