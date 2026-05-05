import SongHistoryHeader from './SongHistoryHeader';
import styles from './SongHistoryListSkeleton.module.scss';

const SongHistoryListSkeleton = () => (
  <>
    <SongHistoryHeader />
    <ul className={styles.skeletonList}>
      {Array.from({ length: 4 }).map((_, groupIdx) => (
        <li key={groupIdx} className={styles.skeletonDateSection}>
          <div className={styles.skeletonDate} />
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

export default SongHistoryListSkeleton;
