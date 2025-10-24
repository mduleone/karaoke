import SongCard from './SongCard';
import type { SongType } from '../types/song';

import styles from './Artist.module.scss';

type ArtistProps = {
	artist: string;
	duet?: boolean;
	songs: SongType[];
	addToRefMap?: (name: string) => (instance: HTMLElement) => void;
};

const Artist = ({ artist, songs, addToRefMap }: ArtistProps) => (
	<ul className={styles.artistSection} ref={addToRefMap?.(artist)}>
		<p className={styles.artistName}>
			{artist} <span className={styles.count}>[{songs.length}]</span>
		</p>
		<ul className={styles.songList}>
			{songs.map((song) => (
				<SongCard key={song.id} song={song} />
			))}
		</ul>
	</ul>
);

export default Artist;
