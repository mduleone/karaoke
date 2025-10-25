'use client';

import { useCallback, useState } from 'react';

import { createSong } from '../actions';
import Modal from './Modal';
import SongForm from './SongForm';
import styles from './AddSongButton.module.scss';
import { FontAwesomeIcon } from './FontAwesomeProvider';

type AddSongButtonProps = {
  className?: string;
};

const AddSongButton: React.FC<AddSongButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const formAction = useCallback(
    async (formData: FormData) => {
      await createSong(formData);
      handleClose();
    },
    [handleClose],
  );

  return (
    <>
      <button type="button" onClick={handleOpen} className={`${className} ${styles.addButton}`}>
        <FontAwesomeIcon icon={['fas', 'plus']} />
      </button>
      <Modal show={isOpen} onClose={handleClose}>
        <SongForm formAction={formAction} />
      </Modal>
    </>
  );
};

export default AddSongButton;
