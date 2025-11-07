import SongHistoryCard from './SongHistoryCard';
import type { SongHistoryType } from '../types/song';

import styles from './HistoryDate.module.scss';

type ArtistProps = {
	date: string;
	songs: SongHistoryType[];
	canDeleteSongs?: boolean;
};

const HistoryDate = ({ date, songs, canDeleteSongs = false }: ArtistProps) => (
	<ul className={styles.dateSection}>
		<p className={styles.date}>{date}</p>
		<ul className={styles.songList}>
			{songs.map((song) => (
				<SongHistoryCard key={`${song.id}-${song.sungAt}`} song={song} canDelete={canDeleteSongs} />
			))}
		</ul>
	</ul>
);

export default HistoryDate;
