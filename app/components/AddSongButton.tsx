'use client';

import { useCallback, useState } from 'react';

import { createSong } from '../actions';
import Modal from './Modal';
import SongForm from './SongForm';
import styles from './AddSongButton.module.scss';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import { toast } from 'react-toastify';

type AddSongButtonProps = {
  className?: string;
};

const AddSongButton: React.FC<AddSongButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
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
