'use client';

import { useCallback, useState } from 'react';

import { createSong } from '../actions/createSong';
import { listSongIdentifiersForUser } from '../actions/listSongIdentifiersForUser';
import { listAllArtists } from '../actions/listAllArtists';
import Modal from './Modal';
import SongForm from './SongForm';
import styles from './AddSongButton.module.scss';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import { useSimpleUserContext } from '../context/simple-user';
import { toast } from 'react-toastify';

type AddSongButtonProps = {
  className?: string;
};

type SongIdentifier = { artist: string; title: string };

const AddSongButton: React.FC<AddSongButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [existingSongs, setExistingSongs] = useState<SongIdentifier[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const { username } = useSimpleUserContext();

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    if (username) {
      const [songs, allArtists] = await Promise.all([
        listSongIdentifiersForUser(username),
        listAllArtists(),
      ]);
      setExistingSongs(songs);
      setArtists(allArtists);
    }
  }, [username]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const formAction = useCallback(
    async (formData: FormData) => {
      const success = await createSong(formData);
      handleClose();
      if (success.statusCode !== 200) {
        toast.error(success.message);
      } else {
        toast.success(`Added ${formData.get('artist')} - ${formData.get('title')}`);
      }
    },
    [handleClose],
  );

  return (
    <>
      <button type="button" aria-label="Add song" onClick={handleOpen} className={`${className} ${styles.addButton}`}>
        <FontAwesomeIcon icon={['fas', 'plus']} />
      </button>
      <Modal show={isOpen} onClose={handleClose}>
        <SongForm formAction={formAction} artists={artists} existingSongs={existingSongs} />
      </Modal>
    </>
  );
};

export default AddSongButton;
