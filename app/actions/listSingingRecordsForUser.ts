'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { db } from '../../db';
import { singingRecords, songs } from '../../db/schema';
import { normalizeUsername } from '../utils/string';

export const listSingingRecordsForUser = async (forUser: string) => {
  const username = normalizeUsername(forUser);
  const cached = unstable_cache(
    async () => {
      try {
        const rows = await db
          .select({
            id: singingRecords.id,
            songArtist: songs.artist,
            songTitle: songs.title,
            recordArtist: singingRecords.songArtist,
            recordTitle: singingRecords.songName,
            songId: singingRecords.songId,
            sungAt: singingRecords.sungAt,
          })
          .from(singingRecords)
          .leftJoin(songs, and(eq(singingRecords.songId, songs.id), isNull(songs.deletedAt)))
          .where(and(eq(singingRecords.username, username), isNull(singingRecords.deletedAt)));

        return rows.map((row) => ({
          id: row.id,
          artist: row.songArtist ?? row.recordArtist,
          title: row.songTitle ?? row.recordTitle,
          songId: row.songId,
          sungAt: row.sungAt,
        }));
      } catch (error) {
        console.error('Error listing singing records:', error);
        return [];
      }
    },
    ['list-singing-records', username],
    { tags: [`user-history:${username}`] },
  );
  const rows = await cached();
  return rows.map((row) => ({
    ...row,
    sungAt: new Date(row.sungAt),
  }));
};
