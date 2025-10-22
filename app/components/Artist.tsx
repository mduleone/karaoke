import SongCard from './SongCard';
import type { SongType } from '../types/song';

import styles from './Artist.module.scss';

type ArtistProps = {
	artist: string;
	duet: boolean;
	songs: SongType[];
};

const Artist = ({ artist, duet, songs }: ArtistProps) => (
	<ul className={styles.artistSection}>
		<p className={styles.artistName}>{artist}</p>
		<ul className={styles.songList}>
			{songs.map((song) => (
				<SongCard key={song.id} song={song} />
			))}
		</ul>
	</ul>
);

export default Artist;
