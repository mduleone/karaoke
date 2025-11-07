'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { setItem, getItem } from '../utils/local-storage';

type SimpleUserContextType = {
  username: string;
  pin: string;
  setUsername: ReturnType<typeof useState<string>>[1];
  setPin: ReturnType<typeof useState<string>>[1];
};

export const SimpleUserContext = createContext<SimpleUserContextType | null>(null);

const SimpleUserProvider = ({ children }: React.FC & { children: React.ReactElement }) => {
  const [username, setUsernameRaw] = useState('');
  const [pin, setPinRaw] = useState('');

  useEffect(() => {
    const usernameFromStorage = getItem('simpleUserUsername') || '';
    const pinFromStorage = getItem('simpleUserPin') || '';
    setUsernameRaw(usernameFromStorage);
    setPinRaw(pinFromStorage);
  }, []);

  const setUsername = (value: string) => {
    setItem('simpleUserUsername', value);
    setUsernameRaw(value);
  };

  const setPin = (value: string) => {
    setItem('simpleUserPin', value);
    setPinRaw(value);
  };

  const value = useMemo(
    () => ({
      username,
      pin,
      setUsername,
      setPin,
    }),
    [username, pin],
  );

  return <SimpleUserContext.Provider value={value}>{children}</SimpleUserContext.Provider>;
};

export const useSimpleUserContext = (): SimpleUserContextType => {
  const context = useContext(SimpleUserContext);
  if (!context) {
    throw new Error('useSimpleUserContext must be used within a KaraokeProvider');
  }

  return context;
};

export default SimpleUserProvider;
