'use client';

import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';

import Artist from './Artist';
import SongCard from './SongCard';
import type { SongType } from '../types/song';
import { useKaraokeSearchContext } from '../context/karaoke';
import '../utils/font-awesome';

import styles from './SongList.module.scss';

config.autoAddCss = false;

const songSorter = ({ title: titleA, artist: artistA }, { title: titleB, artist: artistB }) => {
	const artistCompare = artistA.localeCompare(artistB);
	if (artistCompare !== 0) {
		return artistCompare;
	}

	return titleA.localeCompare(titleB);
};

const artistSorter = ({ artist: artistA }, { artist: artistB }) => artistA.localeCompare(artistB);

const SongList: React.FC<{ songs: SongType[] }> = ({ songs }) => {
	'use client';

	const {
		searchQuery,
		showAvoid,
		favoritesOnly,
		duetsOnly,
		byRecentlyAdded,
		setSearchQuery,
		setShowAvoid,
		setFavoritesOnly,
		setDuetsOnly,
		setByRecentlyAdded,
	} = useKaraokeSearchContext();

	const filteredSongs: SongType[] = useMemo(() => {
		const lowerCaseSearchQuery = searchQuery.toLowerCase();
		return songs
			.filter(
				(song) =>
					song.title.toLowerCase().includes(lowerCaseSearchQuery) ||
					song.artist.toLowerCase().includes(lowerCaseSearchQuery)
			)
			.filter((song) => (showAvoid ? true : !song.avoid))
			.filter((song) => (favoritesOnly ? song.favorite : true))
			.filter((song) => (duetsOnly ? song.duet : true));
	}, [searchQuery, duetsOnly, favoritesOnly, showAvoid, songs]);

	const filteredSongsByArtist = useMemo(() => {
		return filteredSongs
			.reduce((agg, curr) => {
				let next = [...agg];
				let artist = next.find((el) => el.artist === curr.artist && el.duet === curr.duet);
				if (!artist) {
					artist = {
						artist: curr.artist,
						duet: curr.duet,
						songs: [],
					};
					next = [...next, artist];
				}
				artist.songs = [...artist.songs, curr].toSorted(songSorter);

				return next;
			}, [])
			.toSorted(artistSorter);
	}, [filteredSongs]);

	const sortedSongsByAddedDate = useMemo(() => {
		return filteredSongs.toSorted((a, b) => {
			const diff = new Date(b.__createdtime__).getTime() - new Date(a.__createdtime__).getTime();
			return diff !== 0 ? diff : songSorter(a, b);
		});
	}, [filteredSongs]);

	const listClasses = `${styles.artistList}${byRecentlyAdded ? ` ${styles.recentlyAdded}` : ''}`;

	return (
		<div className={styles.songList}>
			<div className={styles.filters}>
				<label htmlFor="search">
					<input
						id="search"
						type="text"
						onChange={(e) => setSearchQuery(e.target.value)}
						value={searchQuery}
						name="search"
						placeholder="Song or Artist Search..."
						className={styles.searchBox}
					/>
				</label>
				<div className={styles.settingsPanel}>
					<button
						type="button"
						onClick={() => setFavoritesOnly((p) => !p)}
						aria-label={`Show ${favoritesOnly ? 'all songs' : 'favorites only'}`}
						className={`${styles.settingsButton}${favoritesOnly ? ` ${styles.enabled}` : ''}`}
					>
						Only <FontAwesomeIcon icon={['fas', 'heart']} />
					</button>
					<button
						type="button"
						onClick={() => setDuetsOnly((p) => !p)}
						aria-label={`Show ${duetsOnly ? 'all songs' : 'duets only'}`}
						className={`${styles.settingsButton} ${styles.noGap}${duetsOnly ? ` ${styles.enabled}` : ''}`}
					>
						<FontAwesomeIcon icon={['fas', 'user-plus']} /> <FontAwesomeIcon icon={['fas', 'user']} />
					</button>
					<button
						type="button"
						onClick={() => setShowAvoid((p) => !p)}
						aria-label={`${showAvoid ? 'Hide' : 'Show'} avoided songs`}
						className={`${styles.settingsButton}${showAvoid ? '' : ` ${styles.enabled}`}`}
					>
						Hide <FontAwesomeIcon icon={['fas', 'microphone-lines-slash']} />
					</button>
					<button
						type="button"
						onClick={() => setByRecentlyAdded((p) => !p)}
						aria-label={`Sort ${byRecentlyAdded ? 'by Recently Added' : 'Artist and Song'}`}
						className={`${styles.settingsButton}${byRecentlyAdded ? ` ${styles.enabled}` : ''}`}
					>
						<FontAwesomeIcon icon={['fas', 'clock-rotate-left']} /> Added
					</button>
				</div>
				<div>
					Showing{' '}
					{filteredSongs.length < songs.length ? `${filteredSongs.length} of ${songs.length}` : `all ${songs.length}`}{' '}
					Songs
				</div>
			</div>
			<ul className={listClasses}>
				{byRecentlyAdded
					? sortedSongsByAddedDate.map((song) => <SongCard key={song.id} song={song} withArtist withAddedDate />)
					: filteredSongsByArtist.map((artistGroup) => (
							<Artist
								key={`${artistGroup.artist}-${artistGroup.duet ? 'duet' : 'solo'}`}
								artist={artistGroup.artist}
								duet={artistGroup.duet}
								songs={artistGroup.songs}
							/>
						))}
			</ul>
		</div>
	);
};

export default SongList;
