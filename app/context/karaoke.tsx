'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type KaraokeSearchContextType = {
	searchQuery: string;
	showAvoid: boolean;
	favoritesOnly: boolean;
	duetsOnly: boolean;
	byRecentlyAdded: boolean;
	setSearchQuery: ReturnType<typeof useState<string>>[1];
	setShowAvoid: ReturnType<typeof useState<boolean>>[1];
	setFavoritesOnly: ReturnType<typeof useState<boolean>>[1];
	setDuetsOnly: ReturnType<typeof useState<boolean>>[1];
	setByRecentlyAdded: ReturnType<typeof useState<boolean>>[1];
};

export const KaraokeSearchContext = createContext<KaraokeSearchContextType | null>(null);

const KaraokeSearchProvider = ({ children }: React.FC & { children: React.ReactElement }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [showAvoid, setShowAvoid] = useState(true);
	const [favoritesOnly, setFavoritesOnly] = useState(false);
	const [duetsOnly, setDuetsOnly] = useState(false);
	const [byRecentlyAdded, setByRecentlyAdded] = useState(false);

	const value = useMemo(
		() => ({
			searchQuery,
			showAvoid,
			favoritesOnly,
			duetsOnly,
			byRecentlyAdded,
			setSearchQuery,
			setShowAvoid,
			setFavoritesOnly,
			setDuetsOnly,
			setByRecentlyAdded,
		}),
		[searchQuery, showAvoid, favoritesOnly, duetsOnly, byRecentlyAdded]
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
