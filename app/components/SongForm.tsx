'use client';

import Link from 'next/link';
import { useRef } from 'react';

import { FontAwesomeIcon } from './FontAwesomeProvider';
import type { SongType } from '../types/song';
import styles from './SongForm.module.scss';
import { useSimpleUserContext } from '../context/simple-user';

type SongFormProps = {
  formAction?: (formData: FormData) => Promise<void>;
  song?: SongType;
  onClose?: () => void;
  disabled?: boolean;
};

const SongForm = ({ formAction, song, disabled = false, onClose }: SongFormProps) => {
  const favoriteRef = useRef<HTMLInputElement>(null);
  const avoidRef = useRef<HTMLInputElement>(null);
  const { username, pin } = useSimpleUserContext();

  const onChangeToggleOppositeExtremity: (
    oppositeRef: ReturnType<typeof useRef<HTMLInputElement>>,
  ) => React.ChangeEventHandler<HTMLInputElement> = (oppositeRef) => (event) => {
    if (event.target.checked && oppositeRef.current) {
      oppositeRef.current.checked = false;
    }
  };

  const FormComponent = disabled ? 'div' : 'form';

  return (
    <div className={styles.page}>
      <div className={styles.formSection}>
        <h2 className={styles.formHeading}>{song ? (disabled ? 'Song Info' : 'Edit Song') : 'Add New Song'}</h2>
        <FormComponent action={disabled ? undefined : formAction} className={styles.form}>
          {song?.id ? <input type="hidden" name="id" value={song.id} /> : null}
          <input type="hidden" name="username" value={username} />
          <input type="hidden" name="pin" value={pin} />
          <div>
            <label className={styles.formLabel} htmlFor="artist">
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              className={styles.textInput}
              placeholder="Sabrina Carpenter"
              defaultValue={song?.artist}
              required
              disabled={disabled}
            />
          </div>
          <div>
            <label className={styles.formLabel} htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.textInput}
              placeholder="Taste"
              defaultValue={song?.title}
              required
              disabled={disabled}
            />
          </div>
          {song && (
            <div className={styles.lyricsLinks}>
              <Link
                href={`https://genius.com/search?q=${encodeURIComponent(`${song.artist} - ${song.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.lyricsLink}
              >
                Genius Lyrics
              </Link>
              <Link
                href={`https://music.youtube.com/search?q=${encodeURIComponent(`${song.artist} - ${song.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.lyricsLink}
              >
                YouTubeMusic
              </Link>
              <Link
                href={`https://open.spotify.com/search/${encodeURIComponent(`${song.artist} - ${song.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.lyricsLink}
              >
                Spotify
              </Link>
            </div>
          )}
          <div>
            <label className={styles.formLabel} htmlFor="notes">
              Notes
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              className={styles.textInput}
              defaultValue={song?.notes}
              disabled={disabled}
            />
          </div>
          <div className={styles.tags}>
            <label className={styles.checkboxLabel} htmlFor="favorite" aria-label="Favorite">
              <FontAwesomeIcon icon={['fas', 'heart']} />
              <input
                type="checkbox"
                id="favorite"
                name="favorite"
                defaultChecked={song?.favorite}
                ref={favoriteRef}
                onChange={onChangeToggleOppositeExtremity(avoidRef)}
                disabled={disabled}
                className={styles.checkboxInput}
              />
            </label>
            <label className={`${styles.checkboxLabel} ${styles.noGap}`} htmlFor="duet" aria-label="Duet">
              <FontAwesomeIcon icon={['fas', 'user-plus']} />
              <FontAwesomeIcon icon={['fas', 'user']} />
              <input
                type="checkbox"
                id="duet"
                name="duet"
                defaultChecked={song?.duet}
                disabled={disabled}
                className={styles.checkboxInput}
              />
            </label>
            <label className={styles.checkboxLabel} htmlFor="avoid" aria-label="Avoid this song">
              <FontAwesomeIcon icon={['fas', 'microphone-lines-slash']} />
              <input
                type="checkbox"
                id="avoid"
                name="avoid"
                defaultChecked={song?.avoid}
                ref={avoidRef}
                onChange={onChangeToggleOppositeExtremity(favoriteRef)}
                disabled={disabled}
                className={styles.checkboxInput}
              />
            </label>
            <label className={styles.checkboxLabel} htmlFor="learn">
              Learn
              <input
                type="checkbox"
                id="learn"
                name="learn"
                defaultChecked={song?.learn}
                disabled={disabled}
                className={styles.checkboxInput}
              />
            </label>
            <label className={styles.checkboxLabel} htmlFor="retry">
              Try Again
              <input
                type="checkbox"
                id="retry"
                name="retry"
                defaultChecked={song?.retry}
                disabled={disabled}
                className={styles.checkboxInput}
              />
            </label>
          </div>
          <button
            type={disabled ? 'button' : 'submit'}
            onClick={disabled ? onClose : undefined}
            className={styles.submitButton}
          >
            {song ? (disabled ? 'Close' : 'Save Song') : 'Add Song'}
          </button>
        </FormComponent>
      </div>
    </div>
  );
};

export default SongForm;
