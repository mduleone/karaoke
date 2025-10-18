import SongCard from './SongCard';
import type { SongType } from '../types/song';

import styles from './Artist.module.scss';

type ArtistProps = {
	artist: string;
	duet: boolean;
	songs: SongType[];
};

const Artist = ({ artist, duet, songs }: ArtistProps) => (
	<section className={styles.artistSection}>
		<p className={styles.artistName}>{artist}</p>
		<div className={styles.songList}>
			{songs.map((song) => (
				<SongCard key={`${song.artist}-${song.title}`} song={song} />
			))}
		</div>
	</section>
);

export default Artist;
