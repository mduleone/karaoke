'use client';

import { useRouter, useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useSimpleUserContext } from '../context/simple-user';
import styles from './SimpleUserForm.module.scss';
import { slugToString, stringToSlug } from '../utils/string';
import { login as loginAction, createAccount as createAccountAction } from '../actions/users';
import { FontAwesomeIcon } from './FontAwesomeProvider';

type Mode = null | 'login' | 'create';

const SimpleUserForm = ({ onClose }: { onClose: () => void }) => {
  const { username, pin, setUsername, setPin } = useSimpleUserContext();
  const [mode, setMode] = useState<Mode>(null);
  const [localUsername, setLocalUsername] = useState('');
  const [localPin, setLocalPin] = useState('');
  const [localError, setLocalError] = useState(null);
  const { push } = useRouter();
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
    push(`/${localUsernameSlug}`);
    window.location.reload();
    onClose();
  }, [localUsername, localPin, setUsername, setPin, push, onClose]);

  const onCreateAccount = useCallback(async () => {
    const localUsernameSlug = stringToSlug(localUsername);
    const success = await createAccountAction(localUsernameSlug, localPin);
    if (success.statusCode !== 200) {
      setLocalError(success.message);
      return;
    }
    setUsername(localUsernameSlug);
    setPin(localPin);
    onClose();
    push(`/${localUsernameSlug}`);
    window.location.reload();
  }, [localUsername, localPin, setUsername, setPin, onClose, push]);

  useEffect(() => {
    const clickListener = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
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

  const handleShareWithAI = useCallback(async (targetUsername: string) => {
    const prompt = `Here is ${targetUsername === stringToSlug(username) ? 'my' : `${targetUsername}'s`} karaoke song list: ${window.location.origin}/${targetUsername}/songs.json`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const input = fallbackRef.current;
        input.value = prompt;
        input.select();
        document.execCommand('copy');
        input.value = '';
      }
      setAiShareStatus('success');
      setTimeout(() => setAiShareStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to copy', error);
      setAiShareStatus('error');
      setTimeout(() => setAiShareStatus('idle'), 3000);
    }
  }, [username]);

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
              fixedWidth
              aria-label={status === 'idle' ? 'Click to copy' : `${status} copying`}
              icon={['fas', status === 'idle' ? 'clipboard' : status === 'success' ? 'circle-check' : 'x']}
            />
          </div>
        </button>
        <button className={styles.share} type="button" onClick={() => handleShareWithAI(stringToSlug(username))}>
          <div className={styles.copyButtonText}>
            {aiShareStatus === 'idle' ? 'Share with AI' : aiShareStatus === 'success' ? 'Copied!' : 'Failed to copy'}
            <FontAwesomeIcon
              aria-label={aiShareStatus === 'idle' ? 'Share with AI' : aiShareStatus === 'success' ? 'Copied' : 'Error'}
              fixedWidth
              icon={['fas', aiShareStatus === 'idle' ? 'robot' : aiShareStatus === 'success' ? 'circle-check' : 'x']}
            />
          </div>
        </button>
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
          <button className={styles.share} type="button" onClick={() => handleShareWithAI(paramsUsername)}>
            <div className={styles.copyButtonText}>
              {aiShareStatus === 'idle' ? 'Share with AI' : aiShareStatus === 'success' ? 'Copied!' : 'Failed to copy'}
              <FontAwesomeIcon
                aria-label={aiShareStatus === 'idle' ? 'Share with AI' : aiShareStatus === 'success' ? 'Copied' : 'Error'}
                icon={['fas', aiShareStatus === 'idle' ? 'robot' : aiShareStatus === 'success' ? 'circle-check' : 'x']}
              />
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
            placeholder="Username"
            onChange={(e) => { setLocalUsername(e.target.value); setLocalError(null); }}
            value={localUsername}
            autoFocus
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
            name="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className={styles.textInput}
            placeholder="Pin"
            onChange={(e) => { setLocalPin(e.target.value); setLocalError(null); }}
            value={localPin}
          />
        </div>
        <div className={styles.buttonRow}>
          <button
            type="submit"
            disabled={!(localUsername && localPin)}
            className={styles.primaryButton}
          >
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => { setMode(null); setLocalError(null); }}>
            Cancel
          </button>
        </div>
        {mode === 'create' && (
          <>
            <p className={styles.pinWarning}>Don&rsquo;t forget your pin!</p>
            <p className={styles.pinWarning}>There is no way to reset it.</p>
          </>
        )}
      </form>
    );
  }

  userForm = <div ref={formRef} className={styles.modal}>{inner}</div>;

  return show && createPortal(userForm, portalElement);
};

export default SimpleUserForm;
