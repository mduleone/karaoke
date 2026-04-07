'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../db';
import { singingRecords, songs } from '../../db/schema';

export const listSingingRecordsForUser = async (forUser: string) => {
  try {
    const lowerCaseUsername = forUser?.toLocaleLowerCase();
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
      .where(and(eq(singingRecords.username, lowerCaseUsername), isNull(singingRecords.deletedAt)));

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
};
