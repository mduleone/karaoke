import SongListFilters from './SongListFilters';
import styles from './SongListSkeleton.module.scss';

const SongListSkeleton = () => (
  <>
    <SongListFilters />
    <ul className={styles.skeletonList}>
      {Array.from({ length: 5 }).map((_, groupIdx) => (
        <li key={groupIdx} className={styles.skeletonArtistSection}>
          <div className={styles.skeletonArtistName} />
          <ul className={styles.skeletonSongList}>
            {Array.from({ length: 3 }).map((__, songIdx) => (
              <li key={songIdx} className={styles.skeletonSongCard} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </>
);

export default SongListSkeleton;
