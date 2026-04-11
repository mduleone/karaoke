'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { login as loginAction, createAccount as createAccountAction } from '../actions/users';
import { useSimpleUserContext } from '../context/simple-user';
import { stringToSlug, slugToString } from '../utils/string';
import styles from './LandingAuth.module.scss';

type Mode = null | 'login' | 'create';

const LandingAuth = () => {
  const { username, pin, setUsername, setPin } = useSimpleUserContext();
  const [mode, setMode] = useState<Mode>(null);
  const [localUsername, setLocalUsername] = useState('');
  const [localPin, setLocalPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const onLogin = useCallback(async () => {
    const slug = stringToSlug(localUsername);
    const result = await loginAction(slug, localPin);
    if (result.statusCode !== 200) {
      setError(result.message);
      return;
    }
    setUsername(slug);
    setPin(localPin);
    window.location.assign(`/${slug}`);
  }, [localUsername, localPin, setUsername, setPin]);

  const onCreateAccount = useCallback(async () => {
    const slug = stringToSlug(localUsername);
    const result = await createAccountAction(slug, localPin);
    if (result.statusCode !== 200) {
      setError(result.message);
      return;
    }
    setUsername(slug);
    setPin(localPin);
    window.location.assign(`/${slug}`);
  }, [localUsername, localPin, setUsername, setPin]);

  const canSubmit = localUsername.trim() && localPin.trim();

  if (username && pin) {
    return (
      <div className={styles.card}>
        <p className={styles.welcomeBack}>Welcome back, {slugToString(username).charAt(0).toLocaleUpperCase() + slugToString(username).slice(1)}.</p>
        <Link href={`/${username}`} className={styles.primaryButton}>
          Go to your list
        </Link>
      </div>
    );
  }

  if (mode === null) {
    return (
      <div className={styles.buttonRow}>
        <button type="button" className={styles.primaryButton} onClick={() => setMode('login')}>
          Log in
        </button>
        <button type="button" className={styles.secondaryButton} onClick={() => setMode('create')}>
          Create account
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    mode === 'login' ? onLogin() : onCreateAccount();
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          className={styles.input}
          placeholder="yourname"
          value={localUsername}
          onChange={(e) => { setLocalUsername(e.target.value); setError(null); }}
          autoFocus
        />
      </div>
      {mode === 'create' && (
        <p className={styles.urlPreview}>
          Share your list:
          <span className={styles.urlPreviewUrl}>
            mykaraoke.info/{localUsername.trim() ? stringToSlug(localUsername) : 'yourname'}
          </span>
        </p>
      )}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="pin">PIN</label>
        <input
          id="pin"
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className={styles.input}
          placeholder="••••"
          value={localPin}
          onChange={(e) => { setLocalPin(e.target.value); setError(null); }}
        />
      </div>
      {mode === 'create' && <p className={styles.warning}>Save your PIN—it can&rsquo;t be recovered.</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonRow}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={!canSubmit}
        >
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        <button type="button" className={styles.secondaryButton} onClick={() => { setMode(null); setError(null); }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default LandingAuth;
