'use client';

import { useCallback, useState } from 'react';
import { deleteSingingRecord } from '../actions/deleteSingingRecord';
import { updateSingingRecord } from '../actions/updateSingingRecord';
import type { SongHistoryType } from '../types/song';
import styles from './SongHistoryCard.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import Modal from './Modal';
import { toast } from 'react-toastify';

type SongProps = {
  song: SongHistoryType;
  canDelete?: boolean;
};

const toDatetimeLocalValue = (date: Date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const SongHistoryCard = ({ song, canDelete = false }: SongProps) => {
  const { username, pin } = useSimpleUserContext();
  const { artist, title, sungAt, id } = song;
  const sungAtDate = new Date(sungAt);
  const createdDate = `${sungAtDate.toLocaleDateString()} ${sungAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sungAtValue, setSungAtValue] = useState(toDatetimeLocalValue(sungAtDate));

  const openModal = useCallback(() => {
    setSungAtValue(toDatetimeLocalValue(sungAtDate));
    setIsModalOpen(true);
  }, [sungAtDate]);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleSave = useCallback(async () => {
    const result = await updateSingingRecord(id, new Date(sungAtValue), username, pin);
    if (result?.statusCode !== undefined) {
      toast.error(result.message);
    } else {
      toast.success('Updated');
      closeModal();
    }
  }, [id, sungAtValue, username, pin, closeModal]);

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
              onClick={() => {
                  if (window.confirm(`Remove this record of singing ${artist} - ${title}?`)) {
                    deleteSingingRecord(id, username, pin);
                  }
                }}
            >
              <FontAwesomeIcon icon={['fas', 'times']} />
            </button>
          )}
        </p>
        <div className={styles.songMeta}>
          <span>{createdDate}</span>
          {canDelete && (
            <button
              className={styles.editButton}
              type="button"
              aria-label="Edit singing record"
              onClick={openModal}
            >
              <FontAwesomeIcon icon={['fas', 'pencil']} />
            </button>
          )}
        </div>
      </div>
      <Modal show={isModalOpen} onClose={closeModal}>
        <div className={styles.editForm}>
          <h2 className={styles.editHeading}>Edit Singing Record</h2>
          <p className={styles.editSongName}>{artist} — {title}</p>
          <label className={styles.editLabel} htmlFor="sung-at">
            Date &amp; Time
          </label>
          <input
            id="sung-at"
            type="datetime-local"
            className={styles.editInput}
            value={sungAtValue}
            onChange={(e) => setSungAtValue(e.target.value)}
          />
          <button type="button" className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>
    </li>
  );
};

export default SongHistoryCard;
