'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type KaraokeSearchContextType = {
  searchQuery: string;
  showAvoid: boolean;
  favoritesOnly: boolean;
  duetsOnly: boolean;
  byRecentlyAdded: boolean;
  byTitle: boolean;
  setSearchQuery: ReturnType<typeof useState<string>>[1];
  setShowAvoid: ReturnType<typeof useState<boolean>>[1];
  setFavoritesOnly: ReturnType<typeof useState<boolean>>[1];
  setDuetsOnly: ReturnType<typeof useState<boolean>>[1];
  setByRecentlyAdded: ReturnType<typeof useState<boolean>>[1];
  setByTitle: ReturnType<typeof useState<boolean>>[1];
};

export const KaraokeSearchContext = createContext<KaraokeSearchContextType | null>(null);

const KaraokeSearchProvider = ({ children }: React.FC & { children: React.ReactElement }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvoid, setShowAvoid] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [duetsOnly, setDuetsOnly] = useState(false);
  const [byRecentlyAdded, setByRecentlyAddedRaw] = useState(false);
  const [byTitle, setByTitleRaw] = useState(false);

  const setByRecentlyAdded = useCallback((value: boolean) => {
    if (value) {
      setByTitleRaw(false);
    }
    setByRecentlyAddedRaw(value);
  }, []);

  const setByTitle = useCallback((value: boolean) => {
    if (value) {
      setByRecentlyAddedRaw(false);
    }
    setByTitleRaw(value);
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      showAvoid,
      favoritesOnly,
      duetsOnly,
      byRecentlyAdded,
      byTitle,
      setSearchQuery,
      setShowAvoid,
      setFavoritesOnly,
      setDuetsOnly,
      setByRecentlyAdded,
      setByTitle,
    }),
    [searchQuery, showAvoid, favoritesOnly, duetsOnly, byRecentlyAdded, byTitle, setByRecentlyAdded, setByTitle],
  );

  return <KaraokeSearchContext.Provider value={value}>{children}</KaraokeSearchContext.Provider>;
};

export const useKaraokeSearchContext = (): KaraokeSearchContextType => {
  const context = useContext(KaraokeSearchContext);
  if (!context) {
    throw new Error('useKaraokeSearchContext must be used within a KaraokeSearchProvider');
  }

  return context;
};

export default KaraokeSearchProvider;
