'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useSimpleUserContext } from '../context/simple-user';
import styles from './SimpleUserForm.module.scss';
import { slugToString, stringToSlug } from '../utils/string';
import { login as loginAction, createAccount as createAccountAction } from '../actions/users';
import { FontAwesomeIcon } from './FontAwesomeProvider';

type Mode = null | 'login' | 'create';

const SimpleUserForm = ({ onClose, triggerRef }: { onClose: () => void; triggerRef?: React.RefObject<HTMLButtonElement> }) => {
  const { username, pin, setUsername, setPin } = useSimpleUserContext();
  const [mode, setMode] = useState<Mode>(null);
  const [localUsername, setLocalUsername] = useState('');
  const [localPin, setLocalPin] = useState('');
  const [localError, setLocalError] = useState(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    setPortalElement(element);
    setShow(true);

    return () => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      setPortalElement(null);
    };
  }, []);

  const onLogout = useCallback(() => {
    setUsername('');
    setPin('');
    onClose();
  }, [setUsername, setPin, onClose]);

  const onLogin = useCallback(async () => {
    const localUsernameSlug = stringToSlug(localUsername);
    const success = await loginAction(localUsernameSlug, localPin);
    if (success.statusCode !== 200) {
      setLocalError(success.message);
      return;
    }
    setUsername(localUsernameSlug);
    setPin(localPin);
    window.location.assign(`/${localUsernameSlug}`);
  }, [localUsername, localPin, setUsername, setPin]);

  const onCreateAccount = useCallback(async () => {
    const localUsernameSlug = stringToSlug(localUsername);
    const success = await createAccountAction(localUsernameSlug, localPin);
    if (success.statusCode !== 200) {
      setLocalError(success.message);
      return;
    }
    setUsername(localUsernameSlug);
    setPin(localPin);
    window.location.assign(`/${localUsernameSlug}`);
  }, [localUsername, localPin, setUsername, setPin]);

  useEffect(() => {
    const clickListener = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        if (triggerRef?.current?.contains(event.target)) return;
        onClose();
      }
    };

    document.addEventListener('mousedown', clickListener);
    return () => {
      document.removeEventListener('mousedown', clickListener);
    };
  }, [onClose]);

  const params = useParams();
  const paramsUsername = params?.username as string | undefined;

  const fallbackRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [aiShareStatus, setAiShareStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const userListUrl = `${window.location.origin}/${paramsUsername}`;

  const copyToClipboard = useCallback(async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = fallbackRef.current;
      input.value = text;
      input.select();
      document.execCommand('copy');
      input.value = '';
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(userListUrl);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy text', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [copyToClipboard, userListUrl]);

  const handleShareWithAI = useCallback(async () => {
    const base = `${window.location.origin}/${paramsUsername}`;
    const prompt = `Here is my karaoke song list: ${base}/songs.json\nHere is my karaoke song history: ${base}/history.json`;
    try {
      await copyToClipboard(prompt);
      setAiShareStatus('success');
      setTimeout(() => setAiShareStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy', error);
      setAiShareStatus('error');
      setTimeout(() => setAiShareStatus('idle'), 3000);
    }
  }, [copyToClipboard, paramsUsername]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(localUsername && localPin)) return;
    mode === 'login' ? onLogin() : onCreateAccount();
  };

  let userForm: React.ReactNode;

  let inner: React.ReactNode;

  if (username && pin) {
    inner = (
      <div className={styles.formSection}>
        <button type="button" aria-label="Copy link to clipboard" className={`${styles.urlBlock}${status === 'success' ? ` ${styles.copied}` : ''}`} onClick={handleCopy}>
          {status === 'success'
            ? <>Copied! <FontAwesomeIcon fixedWidth icon={['fas', 'circle-check']} /></>
            : `${window.location.host}/${paramsUsername}`}
        </button>
        <button className={styles.share} type="button" onClick={() => navigator.share ? navigator.share({ url: userListUrl }) : handleCopy()}>
          <div className={styles.copyButtonText}>
            Share with humans
            <FontAwesomeIcon fixedWidth aria-hidden="true" icon={['fas', 'user-group']} />
          </div>
        </button>
        <button className={styles.share} type="button" aria-label="Copy song list and history links for AI" onClick={handleShareWithAI}>
          <div className={styles.copyButtonText}>
            {aiShareStatus === 'idle' ? 'Share with AI' : aiShareStatus === 'success' ? 'Copied!' : 'Failed to copy'}
            <FontAwesomeIcon
              aria-hidden="true"
              fixedWidth
              icon={['fas', aiShareStatus === 'idle' ? 'robot' : aiShareStatus === 'success' ? 'circle-check' : 'x']}
            />
          </div>
        </button>
        {username !== paramsUsername && (
          <button type="button" className={styles.share} onClick={() => window.location.assign(`/${username}`)}>
            <div className={styles.copyButtonText}>
              Go to your list
              <FontAwesomeIcon fixedWidth aria-hidden="true" icon={['fas', 'right-from-bracket']} />
            </div>
          </button>
        )}
        <div className={styles.buttonRow}>
          <button type="button" className={styles.secondaryButton} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  } else if (mode === null) {
    inner = (
      <div className={styles.formSection}>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.primaryButton} onClick={() => setMode('login')}>
            Log in
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => setMode('create')}>
            Create account
          </button>
        </div>
        {paramsUsername && (
          <button className={styles.share} type="button" onClick={() => navigator.share ? navigator.share({ url: userListUrl }) : handleCopy()}>
            <div className={styles.copyButtonText}>
              Share with humans
              <FontAwesomeIcon fixedWidth aria-hidden="true" icon={['fas', 'user-group']} />
            </div>
          </button>
        )}
      </div>
    );
  } else {
    inner = (
      <form className={styles.formSection} onSubmit={handleSubmit}>
        <div>
          <label className={styles.formLabel} htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            className={styles.textInput}
            placeholder="yourname"
            onChange={(e) => {
              setLocalUsername(e.target.value);
              setLocalError(null);
            }}
            value={localUsername}
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
        {localError && <div className={styles.error}>{localError}</div>}
        <div>
          <label className={styles.formLabel} htmlFor="pin">
            PIN
          </label>
          <input
            type="password"
            id="pin"
            name="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className={styles.textInput}
            placeholder="••••"
            onChange={(e) => {
              setLocalPin(e.target.value);
              setLocalError(null);
            }}
            value={localPin}
          />
        </div>
        {mode === 'create' && (
          <p className={styles.pinWarning}>Save your PIN—it can&rsquo;t be recovered.</p>
        )}
        <div className={styles.buttonRow}>
          <button type="submit" disabled={!(localUsername && localPin)} className={styles.primaryButton}>
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setMode(null);
              setLocalError(null);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  userForm = (
    <div ref={formRef} className={styles.modal}>
      {inner}
      <input ref={fallbackRef} type="text" aria-hidden="true" className={styles.hiddenInput} readOnly />
    </div>
  );

  return show && createPortal(userForm, portalElement);
};

export default SimpleUserForm;
