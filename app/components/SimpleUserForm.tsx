'use client';

import { useRouter } from 'next/navigation';
import { useSimpleUserContext } from '../context/simple-user';
import styles from './SimpleUserForm.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import { slugToString, stringToSlug } from '../utils/string';

const SimpleUserForm = ({ onClose }: { onClose: () => void }) => {
  const { username, pin, setUsername, setPin } = useSimpleUserContext();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const clear = useCallback(() => {
    setUsername('');
    setPin('');
    router.replace(`/`);
  }, [setUsername, setPin, router]);

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

  return (
    <div ref={formRef} className={styles.page}>
      <div className={styles.formSection}>
        <div>
          <label className={styles.formLabel} htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={styles.textInput}
            placeholder="Username"
            onChange={(e) => {
              const value = e.target.value;
              setUsername(slugToString(stringToSlug(value)));
              router.replace(`/${stringToSlug(value)}`);
            }}
            value={username}
          />
        </div>
        <div>
          <label className={styles.formLabel} htmlFor="pin">
            Pin
          </label>
          <input
            type="password"
            id="pin"
            className={styles.textInput}
            placeholder="Pin"
            onChange={(e) => setPin(e.target.value)}
            value={pin}
          />
        </div>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.submitButton} onClick={onClose}>
            Close
          </button>
          <button type="button" className={styles.clearButton} onClick={clear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleUserForm;
