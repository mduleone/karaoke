'use client';

import { useCallback, useMemo } from 'react';

import Artist from './Artist';
import AddedDate from './AddedDate';
import SongListFilters from './SongListFilters';
import type { ArtistType, SongType } from '../types/song';
import { useKaraokeSearchContext } from '../context/karaoke';
import styles from './SongList.module.scss';
import useAlphabetScroller from '../hooks/useAlphabetScroller';
import { compareArtists, normalizeForSearch } from '../utils/string';

const songSorterByTitle = ({ title: titleA, artist: artistA }, { title: titleB, artist: artistB }) => {
  const titleCompare = titleA.localeCompare(titleB);
  if (titleCompare !== 0) {
    return titleCompare;
  }

  return compareArtists(artistA, artistB);
};

const songSorterByArtist = ({ title: titleA, artist: artistA }, { title: titleB, artist: artistB }) => {
  const artistCompare = compareArtists(artistA, artistB);
  if (artistCompare !== 0) {
    return artistCompare;
  }

  return titleA.localeCompare(titleB);
};

const artistSorter = ({ artist: artistA }, { artist: artistB }) => compareArtists(artistA, artistB);
const TOP_OFFSET = 208;

const SongList: React.FC<{ songs: SongType[] }> = ({ songs }) => {
  'use client';
  const { searchQuery, showAvoid, favoritesOnly, duetsOnly, byRecentlyAdded, byTitle } = useKaraokeSearchContext();

  const filteredSongs: SongType[] = useMemo(() => {
    const normalizedQuery = normalizeForSearch(searchQuery);
    return songs
      .filter(
        (song) =>
          normalizeForSearch(song.title).includes(normalizedQuery) ||
          normalizeForSearch(song.artist).includes(normalizedQuery),
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

  const songsByAddedDate = useMemo(() => {
    const sorted = filteredSongs.toSorted((a, b) => {
      const diff = b.createdAt.getTime() - a.createdAt.getTime();
      return diff !== 0 ? diff : songSorterByArtist(a, b);
    });
    return sorted.reduce(
      (agg, song) => {
        const dateKey = song.createdAt.toLocaleDateString();
        let group = agg.find((g) => g.date === dateKey);
        if (!group) {
          group = { date: dateKey, songs: [] };
          agg.push(group);
        }
        group.songs.push(song);
        return agg;
      },
      [] as { date: string; songs: SongType[] }[],
    );
  }, [filteredSongs]);

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

  return (
    <>
      <SongListFilters filteredCount={filteredSongs.length} totalCount={songs.length} />
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
      <ul className={styles.artistList}>
        {byRecentlyAdded &&
          songsByAddedDate.map((group) => <AddedDate key={group.date} date={group.date} songs={group.songs} />)}
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
