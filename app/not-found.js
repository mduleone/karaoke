import styles from './not-found.module.scss';

export default function NotFound() {
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>🐶 404 - Page Not Found</h1>
			<p className={styles.message}>Sorry, the page you are looking for does not exist.</p>
		</div>
	);
}
