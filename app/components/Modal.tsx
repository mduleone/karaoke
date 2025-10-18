'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

type ModalProps = {
	children: ReactNode;
	onClose?: () => void;
	show: boolean;
};

const Modal = ({ children, onClose, show }: ModalProps) => {
	const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!show) {
			return undefined;
		}

		const element = document.createElement('div');
		document.body.appendChild(element);
		setPortalElement(element);

		return () => {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
			setPortalElement(null);
		};
	}, [show]);

	useEffect(() => {
		if (!show || !onClose) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [show, onClose]);

	if (!show || !portalElement) {
		return null;
	}

	const handleBackdropClick = () => {
		if (onClose) {
			onClose();
		}
	};

	const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	};

	const modalContent = (
		<div className={styles.modalScreen} role="presentation" onClick={handleBackdropClick}>
			<div className={styles.modal} role="dialog" aria-modal="true" onClick={stopPropagation}>
				{onClose ? (
					<button type="button" aria-label="Close modal" className={styles.closeButton} onClick={onClose}>
						✖️
					</button>
				) : null}
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);

	return createPortal(modalContent, portalElement);
};

export default Modal;
