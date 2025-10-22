'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import HistoryDate from './HistoryDate';
import type { SongHistoryType } from '../types/song';
import styles from './SongHistoryList.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import Link from 'next/link';

const songSorter = ({ title: titleA, artist: artistA }, { title: titleB, artist: artistB }) => {
	const artistCompare = artistA.localeCompare(artistB);
	if (artistCompare !== 0) {
		return artistCompare;
	}

	return titleA.localeCompare(titleB);
};

const leadWithZero = (candidate: number) => {
	if (candidate.toString().length === 1) {
		return `0${candidate}`;
	}
	return `${candidate}`;
};

const getSortableDateString = (date: Date) => {
	return `${date.getFullYear()}-${leadWithZero(date.getMonth())}-${leadWithZero(date.getDate())}`;
};

const SongHistoryList: React.FC<{ songs: SongHistoryType[] }> = ({ songs }) => {
	'use client';
	const { username, pin } = useSimpleUserContext();
	const params = useParams();

	const signedIn = Boolean(username && pin);
	const isGenericListAndUserIsMatt = username === 'matt' && params.username === undefined;
	const notMyUser = username !== params?.username;
	const isWrongUserToEdit = signedIn && notMyUser && !isGenericListAndUserIsMatt;
	const canDeleteSongs = signedIn && !isWrongUserToEdit;

	const sortedSongsByAddedDate = useMemo(() => {
		return songs
			.reduce((agg, curr) => {
				let next = [...agg];
				const { sungAt } = curr;
				const sungAtDateObj = new Date(sungAt);
				const sungAtDateSorter = getSortableDateString(sungAtDateObj);
				let dateGroup = next.find((el) => el.dateSorter === sungAtDateSorter);
				if (!dateGroup) {
					dateGroup = {
						dateSorter: sungAtDateSorter,
						dateDisplay: sungAtDateObj.toLocaleDateString(),
						songs: [],
					};
					next = [...next, dateGroup];
				}
				dateGroup.songs = [...dateGroup.songs, curr].toSorted((a, b) => {
					const diff = b.sungAt - a.sungAt;
					return diff !== 0 ? diff : songSorter(b, a);
				});

				return next;
			}, [])
			.toSorted((dateA, dateB) => dateB.dateSorter.localeCompare(dateA.dateSorter));
	}, [songs]);

	const userLink = `/${username === 'matt' ? '' : username}`;

	return (
		<div className={styles.songList}>
			<h1>Singing History</h1>
			<ul className={styles.historyList}>
				{sortedSongsByAddedDate.map((dateGroup) => (
					<HistoryDate
						key={dateGroup.dateSorter}
						date={dateGroup.dateDisplay}
						songs={dateGroup.songs}
						canDeleteSongs={canDeleteSongs}
					/>
				))}
			</ul>
		</div>
	);
};

export default SongHistoryList;
