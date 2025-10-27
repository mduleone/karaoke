'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useSimpleUserContext } from '../context/simple-user';
import styles from './SimpleUserForm.module.scss';
import { slugToString, stringToSlug } from '../utils/string';
import { login as loginAction, createAccount as createAccountAction } from '../actions';
import { FontAwesomeIcon } from './FontAwesomeProvider';
import Link from 'next/link';
import cx from '../utils/classnames';

const SimpleUserForm = ({ onClose }: { onClose: () => void }) => {
  const { username, pin, setUsername, setPin } = useSimpleUserContext();
  const [localUsername, setLocalUsername] = useState('');
  const [localPin, setLocalPin] = useState('');
  const [localError, setLocalError] = useState(null);
  const { push } = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const onLogout = useCallback(() => {
    setUsername('');
    setPin('');
    onClose();
  }, [setUsername, setPin, onClose]);

  const onLogin = useCallback(() => {
    const login = async () => {
      const success = await loginAction(localUsername, localPin);
      if (success.statusCode !== 200) {
        setLocalError(success.message);
        return;
      }
      setUsername(localUsername);
      setPin(localPin);
      push(`/${stringToSlug(localUsername)}`);
      onClose();
    };

    login();
  }, [localUsername, localPin, setUsername, setPin, push, onClose]);

  const onCreateAccount = useCallback(() => {
    const createAccount = async () => {
      const success = await createAccountAction(localUsername, localPin);
      if (success.statusCode !== 200) {
        setLocalError(success.message);
        return;
      }
      setUsername(localUsername);
      setPin(localPin);
      onClose();
      push(`/${stringToSlug(localUsername)}`);
    };

    createAccount();
  }, [localUsername, localPin, setUsername, setPin, onClose, push]);

  useEffect(() => {
    const clickListener = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('click', clickListener);
    return () => {
      document.removeEventListener('click', clickListener);
    };
  }, [onClose]);

  const fallbackRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const userListUrl = `${window.location.host}/${stringToSlug(username)}`;

  const copyViaClipboardApi = useCallback(async () => {
    await navigator.clipboard.writeText(userListUrl);
  }, [userListUrl]);

  const copyViaFallback = useCallback(() => {
    const input = fallbackRef.current;
    input.value = userListUrl;
    input.select();
    document.execCommand('copy');
    input.value = '';
  }, [userListUrl]);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await copyViaClipboardApi();
      } else {
        copyViaFallback();
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy text', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [copyViaClipboardApi, copyViaFallback]);

  if (username && pin) {
    return (
      <div ref={formRef} className={styles.modal}>
        <div className={styles.formSection}>
          <div>
            <label className={styles.formLabel} htmlFor="username">
              Share your list!
            </label>
            <input
              type="text"
              id="username"
              className={styles.textInput}
              ref={fallbackRef}
              disabled
              value={`${window.location.host}/${slugToString(username)}`}
            />
          </div>
          <button className={styles.share} type="button" onClick={handleCopy}>
            <div className={styles.copyButtonText}>
              Copy to Clipboard
              <FontAwesomeIcon
                aria-label={status === 'idle' ? 'Click to copy' : `${status} copying`}
                icon={['fas', status === 'idle' ? 'clipboard' : status === 'success' ? 'circle-check' : 'x']}
              />
            </div>
          </button>
          <Link className={styles.goToList} href={`/${stringToSlug(username)}`}>
            Go to your list
          </Link>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.secondaryButton} onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className={styles.modal}>
      <div className={styles.formSection}>
        <div>
          <label className={styles.formLabel} htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            autoComplete="username"
            className={styles.textInput}
            placeholder="Username"
            onChange={(e) => {
              setLocalUsername(e.target.value);
              setLocalError(null);
            }}
            value={localUsername}
          />
        </div>
        {localError && <div className={styles.error}>{localError}</div>}
        <div>
          <label className={styles.formLabel} htmlFor="pin">
            Pin
          </label>
          <input
            type="password"
            id="pin"
            className={styles.textInput}
            placeholder="Pin"
            onChange={(e) => {
              setLocalPin(e.target.value);
              setLocalError(null);
            }}
            value={localPin}
          />
        </div>
        <div className={styles.buttonRow}>
          <button
            type="button"
            disabled={!(localUsername && localPin)}
            className={styles.primaryButton}
            onClick={onLogin}
          >
            Login
          </button>
          <button
            type="button"
            disabled={!(localUsername && localPin)}
            className={styles.secondaryButton}
            onClick={onCreateAccount}
          >
            Create Account
          </button>
        </div>
        <p className={styles.pinWarning}>Don&rsquo;t forget your pin!</p>
        <p className={styles.pinWarning}>There is no way to reset it.</p>
      </div>
    </div>
  );
};

export default SimpleUserForm;
