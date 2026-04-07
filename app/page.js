import Link from 'next/link';
import LandingAuth from './components/LandingAuth';
import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.landing}>
      <div className={styles.hero}>
        <h1 className={styles.title}>myKaraoke</h1>
        <p className={styles.tagline}>Your karaoke song list, always in your pocket.</p>
        <LandingAuth />
        <Link href="/matt" className={styles.exampleLink}>
          or peek at Matt&rsquo;s list first
        </Link>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🎤</span>
          <div>
            <h2 className={styles.featureTitle}>Build your list</h2>
            <p className={styles.featureBody}>Keep track of every song you love to sing, all in one place.</p>
          </div>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>⭐</span>
          <div>
            <h2 className={styles.featureTitle}>Stay organized</h2>
            <p className={styles.featureBody}>Mark favorites, flag duets, and tag songs you want to learn or retry.</p>
          </div>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📋</span>
          <div>
            <h2 className={styles.featureTitle}>Track your history</h2>
            <p className={styles.featureBody}>Log what you&rsquo;ve sung and share your list with friends.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
