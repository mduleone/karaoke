'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import type { SongType } from '../types/song';
import styles from './SongForm.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import { FontAwesomeIcon } from './FontAwesomeProvider';

type SongFormProps = {
  formAction?: (formData: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  onSing?: () => Promise<void>;
  song?: SongType;
  onClose?: () => void;
  disabled?: boolean;
  artists?: string[];
  existingSongs?: { artist: string; title: string }[];
  sungHistory?: { id: string; sungAt: Date }[];
};

const SongForm = ({ formAction, onDelete, onSing, song, disabled = false, onClose, artists = [], existingSongs = [], sungHistory = [] }: SongFormProps) => {
  const favoriteRef = useRef<HTMLInputElement>(null);
  const avoidRef = useRef<HTMLInputElement>(null);
  const { username, pin } = useSimpleUserContext();
  const [localArtist, setLocalArtist] = useState('');
  const [localTitle, setLocalTitle] = useState('');

  const isDuplicate = !song && localArtist && localTitle &&
    existingSongs.some(
      (s) => s.artist.toLowerCase() === localArtist.toLowerCase() &&
             s.title.toLowerCase() === localTitle.toLowerCase()
    );

  const onChangeToggleOppositeExtremity: (
    oppositeRef: ReturnType<typeof useRef<HTMLInputElement>>,
  ) => React.ChangeEventHandler<HTMLInputElement> = (oppositeRef) => (event) => {
    if (event.target.checked && oppositeRef.current) {
      oppositeRef.current.checked = false;
    }
  };

  const FormComponent = disabled ? 'div' : 'form';

  return (
    <div className={styles.container}>
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
              list="artist-suggestions"
              className={styles.textInput}
              placeholder="Sabrina Carpenter"
              defaultValue={song?.artist}
              required
              disabled={disabled}
              autoComplete="off"
              onChange={(e) => setLocalArtist(e.target.value)}
            />
            {artists.length > 0 && (
              <datalist id="artist-suggestions">
                {artists.map((a) => <option key={a} value={a} />)}
              </datalist>
            )}
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
              onChange={(e) => setLocalTitle(e.target.value)}
            />
          </div>
          {isDuplicate && (
            <p className={styles.duplicateWarning}>You already have this song in your list.</p>
          )}
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
          {sungHistory.length > 0 && (
            <div>
              <p className={styles.formLabel}>
                Sung {sungHistory.length} time{sungHistory.length === 1 ? '' : 's'}
              </p>
              <ul className={styles.sungHistoryList}>
                {sungHistory.slice(0, 5).map((record) => {
                  const d = new Date(record.sungAt);
                  return (
                    <li key={record.id} className={styles.sungHistoryEntry}>
                      {d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })} {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div>
            <label className={styles.formLabel} htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              className={styles.textArea}
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
              <FontAwesomeIcon widthAuto icon={['fas', 'user-plus']} />
              <FontAwesomeIcon widthAuto icon={['fas', 'user']} />
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
          {(onSing || onDelete) && (
            <>
              <hr className={styles.divider} />
              <div className={styles.quickActions}>
                {onDelete && (
                  <button type="button" className={`${styles.quickActionButton} ${styles.deleteAction}`} onClick={onDelete} aria-label="Delete song">
                    <FontAwesomeIcon icon={['fas', 'xmark']} />
                  </button>
                )}
                {onSing && (
                  <button type="button" className={styles.quickActionButton} onClick={onSing} aria-label="Record singing">
                    <FontAwesomeIcon icon={['fas', 'microphone-lines']} />
                  </button>
                )}
              </div>
            </>
          )}
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
