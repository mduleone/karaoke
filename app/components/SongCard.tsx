'use client';

import { MouseEventHandler, useCallback, useState } from 'react';
import { useParams } from 'next/navigation';

import { updateSong } from '../actions/updateSong';
import { singSong } from '../actions/singSong';
import type { SongType } from '../types/song';
import Modal from './Modal';
import SongForm from './SongForm';
import styles from './SongCard.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import cx from '../utils/classnames';
import { toast } from 'react-toastify';

type SongProps = {
  song: SongType;
  withArtist?: boolean;
  withAddedDate?: boolean;
  addToRefMap?: (name: string) => (instance: HTMLElement) => void;
};

const SongCard = ({ song, withArtist = false, withAddedDate = false, addToRefMap }: SongProps) => {
  const { artist, title, favorite, duet, learn, retry, avoid, tags, __createdtime__ } = song;

  const createdDate = new Date(__createdtime__).toLocaleDateString();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username, pin } = useSimpleUserContext();
  const params = useParams();

  const signedIn = Boolean(username && pin);
  const isGenericListAndUserIsMatt = username === 'matt' && params.username === undefined;
  const notMyUser = username !== params?.username;
  const isWrongUserToEdit = signedIn && notMyUser && !isGenericListAndUserIsMatt;
  const canEditSong = signedIn && !isWrongUserToEdit;

  const openModal = () => setIsModalOpen(true);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const formAction = useCallback(
    async (formData: FormData) => {
      const success = await updateSong(formData);
      closeModal();
      if (success.statusCode !== 200) {
        toast.error(success.message);
      } else {
        toast.success(`Updated ${formData.get('artist')} - ${formData.get('title')}`);
      }
    },
    [closeModal],
  );

  const tagsCount = [duet, learn, retry].reduce((agg, curr) => agg + Number(curr), 0);
  const extraTagsCount = [learn, retry].reduce((agg, curr) => agg + Number(curr), 0);

  const cardStyles = cx(styles.songCard, {
    [styles.avoid]: avoid,
    [styles.favorite]: favorite,
    [styles.withUserOrTags]: canEditSong || tagsCount > 0,
  });

  const tagsAndActionsStyles = cx(styles.tagsAndActions, { [styles.rowReverse]: canEditSong && tagsCount === 0 });

  const confirmationMessage = `You're about to sing:\n` + `${song.artist} - ${song.title}`;
  const singSongAction: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      event.preventDefault();
      if (canEditSong && window.confirm(confirmationMessage)) {
        const success = await singSong(song.id, song.artist, song.title, username, pin);
        if (success.statusCode !== 200) {
          toast.error(success.message);
        } else {
          toast.success(`You sang ${song.artist} - ${song.title}`);
        }
      }
    },
    [song.id, song.artist, song.title, username, pin, canEditSong, confirmationMessage],
  );

  const CardComponent = canEditSong ? 'div' : 'button';
  const cardComponentProps = canEditSong ? {} : { onClick: openModal };

  return (
    <li ref={addToRefMap?.(title)}>
      <CardComponent {...cardComponentProps} className={cardStyles}>
        <p className={styles.songTitle}>
          <span>{title}</span>
          {favorite && <FontAwesomeIcon icon={['fas', 'heart']} />}
          {avoid && <FontAwesomeIcon icon={['fas', 'microphone-lines-slash']} />}
        </p>
        {withArtist && <p className={styles.songMeta}>{artist}</p>}
        {withAddedDate && <p className={styles.songMeta}>Added {createdDate}</p>}
        <div className={tagsAndActionsStyles}>
          {tagsCount > 0 && (
            <ul className={styles.tags}>
              {duet && (
                <li className={cx(styles.tag, styles.duet, styles.noGap)}>
                  <FontAwesomeIcon widthAuto icon={['fas', 'user-plus']} />
                  <FontAwesomeIcon widthAuto icon={['fas', 'user']} />
                </li>
              )}
              {extraTagsCount > 0 && (
                <li className={cx(styles.tag)}>
                  +{extraTagsCount} Tag{extraTagsCount === 1 ? '' : 's'}
                </li>
              )}
              {/* {learn && <li className={cx(styles.tag, styles.learn)}>Learn</li>}
              {retry && <li className={cx(styles.tag, styles.retry)}>Retry</li>} */}
            </ul>
          )}
          {canEditSong && (
            <div className={styles.songButtons}>
              <button type="button" className={styles.songButton} onClick={openModal}>
                <FontAwesomeIcon icon={['fas', 'pencil']} />
              </button>
              <button type="button" className={styles.songButton} onClick={singSongAction}>
                <FontAwesomeIcon icon={['fas', 'microphone-lines']} />
              </button>
            </div>
          )}
        </div>
      </CardComponent>
      <Modal show={isModalOpen} onClose={closeModal}>
        <SongForm formAction={formAction} song={song} disabled={!canEditSong} onClose={closeModal} />
      </Modal>
    </li>
  );
};

export default SongCard;
