import SongCard from './SongCard';
import type { SongType } from '../types/song';

import styles from './Artist.module.scss';

type AddedDateProps = {
  date: string;
  songs: SongType[];
};

const AddedDate = ({ date, songs }: AddedDateProps) => (
  <li className={styles.artistSection}>
    <p className={styles.artistName}>{date}</p>
    <ul className={styles.songList}>
      {songs.map((song) => (
        <SongCard key={song.id} song={song} withArtist />
      ))}
    </ul>
  </li>
);

export default AddedDate;
