'use client';

import { useCallback, useState } from 'react';
import { updateSong } from '../actions';
import type { SongType } from '../types/song';
import Modal from './Modal';
import SongForm from './SongForm';
import styles from './SongCard.module.scss';
import { useSimpleUserContext } from '../context/simple-user';
import { useParams } from 'next/navigation';

type SongProps = {
	song: SongType;
	withArtist?: boolean;
	withAddedDate?: boolean;
};

const SongCard = ({ song, withArtist = false, withAddedDate = false }: SongProps) => {
	const { artist, title, favorite, duet, learn, retry, avoid, tags, __createdtime__ } = song;
	const cardStyles = `${styles.songCard}${avoid ? ` ${styles.avoid}` : ''}${favorite ? ` ${styles.favorite}` : ''}`;
	const createdDate = new Date(__createdtime__).toLocaleDateString();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { username, pin } = useSimpleUserContext();
	const params = useParams();

	const signedIn = Boolean(username && pin);
	const isGenericListAndUserIsMatt = username === 'matt' && params.username === undefined;
	const notMyUser = username !== params?.username;
	const isWrongUserToEdit = signedIn && notMyUser && !isGenericListAndUserIsMatt;
	const cantEditSong = !signedIn || isWrongUserToEdit;

	const openModal = () => setIsModalOpen(true);
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	const formAction = useCallback(
		async (formData: FormData) => {
			await updateSong(formData);
			closeModal();
		},
		[closeModal]
	);

	const tagsCount = [duet ? 'Duet' : null, learn ? 'Learn' : null, retry ? 'Retry' : null, ...(tags ?? [])].filter(
		Boolean
	).length;

	return (
		<li>
			<button type="button" className={cardStyles} onClick={openModal}>
				<p className={styles.songTitle}>
					<span>{title}</span>
					{favorite && <span>❤️</span>}
					{avoid && <span>❌</span>}
				</p>
				{withArtist && <p className={styles.songMeta}>{artist}</p>}
				{withAddedDate && <p className={styles.songMeta}>Added: {createdDate}</p>}
				{tagsCount > 0 && (
					<ul className={styles.tags}>
						{duet && <li className={`${styles.tag} ${styles.duet}`}>Duet</li>}
						{learn && <li className={`${styles.tag} ${styles.learn}`}>Learn</li>}
						{retry && <li className={`${styles.tag} ${styles.retry}`}>Retry</li>}
					</ul>
				)}
			</button>
			<Modal show={isModalOpen} onClose={closeModal}>
				<SongForm formAction={formAction} song={song} disabled={cantEditSong} onClose={closeModal} />
			</Modal>
		</li>
	);
};

export default SongCard;
