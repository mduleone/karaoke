'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { db } from '../../db';
import { songs } from '../../db/schema';
import { normalizeUsername } from '../utils/string';

export const listSongs = async (forUser?: string) => {
  const username = normalizeUsername(forUser) || 'matt';
  const cached = unstable_cache(
    async () => {
      try {
        return await db.select().from(songs).where(and(eq(songs.username, username), isNull(songs.deletedAt)));
      } catch (error) {
        console.error('Error listing songs:', error);
        return [];
      }
    },
    ['list-songs', username],
    { tags: [`user-songs:${username}`] },
  );
  const rows = await cached();
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt ? new Date(row.createdAt) : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    deletedAt: row.deletedAt ? new Date(row.deletedAt) : null,
  }));
};
