'use client';

import { deleteSingingRecord } from '../actions/deleteSingingRecord';
import type { SongHistoryType } from '../types/song';
import styles from './SongHistoryCard.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import { FontAwesomeIcon } from './FontAwesomeProvider';

type SongProps = {
  song: SongHistoryType;
  canDelete?: boolean;
};

const SongHistoryCard = ({ song, canDelete = false }: SongProps) => {
  const { username, pin } = useSimpleUserContext();
  const { artist, title, sungAt, id } = song;
  const sungAtDate = new Date(sungAt);
  const createdDate = `${sungAtDate.toLocaleDateString()} ${sungAtDate.toLocaleTimeString()}`;

  return (
    <li>
      <div className={styles.songCard}>
        <p className={styles.songTitle}>
          <span>
            {artist} - {title}
          </span>
          {canDelete && (
            <button
              className={styles.deleteButton}
              type="button"
              aria-label="Delete Singing Record"
              onClick={() => deleteSingingRecord(id, username, pin)}
            >
              <FontAwesomeIcon icon={['fas', 'times']} />
            </button>
          )}
        </p>
        <p className={styles.songMeta}>{createdDate}</p>
      </div>
    </li>
  );
};

export default SongHistoryCard;
