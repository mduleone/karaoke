'use client';

import { useParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

import Artist from './Artist';
import SongCard from './SongCard';
import type { ArtistType, SongType } from '../types/song';
import { useKaraokeSearchContext } from '../context/karaoke';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import styles from './SongList.module.scss';
import useAlphabetScroller from '../hooks/useAlphabetScroller';
import { slugToString } from '../utils/string';
import cx from '../utils/classnames';

const songSorterByTitle = ({ title: titleA, artist: artistA }, { title: titleB, artist: artistB }) => {
  const titleCompare = titleA.localeCompare(titleB);
  if (titleCompare !== 0) {
    return titleCompare;
  }

  return artistA.localeCompare(artistB);
};

const songSorterByArtist = ({ title: titleA, artist: artistA }, { title: titleB, artist: artistB }) => {
  const artistCompare = artistA.localeCompare(artistB);
  if (artistCompare !== 0) {
    return artistCompare;
  }

  return titleA.localeCompare(titleB);
};

const artistSorter = ({ artist: artistA }, { artist: artistB }) => artistA.localeCompare(artistB);
const TOP_OFFSET = 208;

const SongList: React.FC<{ songs: SongType[] }> = ({ songs }) => {
  'use client';
  const { username: paramsUsername } = useParams() as { username?: string };

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

  const filteredSongs: SongType[] = useMemo(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(lowerCaseSearchQuery) ||
          song.artist.toLowerCase().includes(lowerCaseSearchQuery),
      )
      .filter((song) => (showAvoid ? true : !song.avoid))
      .filter((song) => (favoritesOnly ? song.favorite : true))
      .filter((song) => (duetsOnly ? song.duet : true));
  }, [searchQuery, duetsOnly, favoritesOnly, showAvoid, songs]);

  const filteredSongsByArtist: ArtistType[] = useMemo(() => {
    return filteredSongs
      .reduce((agg, curr) => {
        let next = [...agg];
        let artist = next.find((el) => el.artist === curr.artist);
        if (!artist) {
          artist = {
            artist: curr.artist,
            songs: [],
          };
          next = [...next, artist];
        }
        artist.songs = [...artist.songs, curr].toSorted(songSorterByArtist);

        return next;
      }, [])
      .toSorted(artistSorter);
  }, [filteredSongs]);

  const filteredSongsByTitle: ArtistType[] = useMemo(() => {
    return filteredSongs
      .reduce((agg, curr) => {
        let next = [...agg];
        const titleGroupIdCandidate = curr.title.charAt(0).toUpperCase();
        const titleGroupId = /[0-9]/.test(titleGroupIdCandidate) ? '#' : titleGroupIdCandidate;
        let titleGroup = next.find((el) => el.artist === titleGroupId);
        if (!titleGroup) {
          titleGroup = {
            artist: titleGroupId,
            songs: [],
          };
          next = [...next, titleGroup];
        }
        titleGroup.songs = [...titleGroup.songs, curr].toSorted(songSorterByTitle);

        return next;
      }, [])
      .toSorted(artistSorter);
  }, [filteredSongs]);

  const sortedSongsByAddedDate = useMemo(() => {
    return filteredSongs.toSorted((a, b) => {
      const diff = new Date(b.__createdtime__).getTime() - new Date(a.__createdtime__).getTime();
      return diff !== 0 ? diff : songSorterByArtist(a, b);
    });
  }, [filteredSongs]);

  const listClasses = cx(styles.artistList, { [styles.standAloneSongCards]: byRecentlyAdded });
  const isMatt = paramsUsername === 'matt' || typeof paramsUsername === 'undefined';
  const stringName = slugToString(paramsUsername);
  const displayUsername = stringName && stringName.charAt(0).toLocaleUpperCase() + stringName.slice(1);

  const { lettersRefMap, addToRefMap, lettersMapState } = useAlphabetScroller(
    byTitle ? filteredSongsByTitle : filteredSongsByArtist,
    byTitle,
  );

  const handleLetterClick = useCallback(
    (letter: string) => {
      const rect = lettersRefMap[letter][0].getBoundingClientRect();
      const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
      const top = rect.top + scrollOffset - TOP_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [lettersRefMap],
  );

  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={styles.filters}>
        <h2>{isMatt ? 'Matt' : displayUsername}&rsquo;s List</h2>
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
          Showing{' '}
          {filteredSongs.length < songs.length ? `${filteredSongs.length} of ${songs.length}` : `all ${songs.length}`}{' '}
          Songs
        </div>
      </div>
      {!byRecentlyAdded && (
        <div className={styles.scrollLetters}>
          {lettersMapState.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => handleLetterClick(letter)}
              className={styles.scrollLetter}
            >
              {letter}
            </button>
          ))}
        </div>
      )}
      <ul className={listClasses}>
        {byRecentlyAdded &&
          sortedSongsByAddedDate.map((song) => (
            <SongCard addToRefMap={addToRefMap} key={song.id} song={song} withArtist withAddedDate />
          ))}
        {!byRecentlyAdded &&
          (byTitle ? filteredSongsByTitle : filteredSongsByArtist).map((artistGroup) => (
            <Artist
              key={artistGroup.artist}
              artist={artistGroup.artist}
              songs={artistGroup.songs}
              addToRefMap={addToRefMap}
              byTitle={byTitle}
            />
          ))}
      </ul>
      {/* <button className={styles.fab}>
        <FontAwesomeIcon size="xl" icon={['fas', 'music']} />
      </button> */}
    </>
  );
};

export default SongList;
