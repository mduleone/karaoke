'use server';

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { singingRecords, songs } from '../../db/schema';

export const listSingingRecordsForUser = async (forUser: string) => {
  try {
    const lowerCaseUsername = forUser?.toLocaleLowerCase();
    return await db
      .select({
        id: singingRecords.id,
        artist: songs.artist,
        title: songs.title,
        songId: singingRecords.songId,
        sungAt: singingRecords.sungAt,
      })
      .from(singingRecords)
      .innerJoin(songs, eq(singingRecords.songId, songs.id))
      .where(eq(singingRecords.username, lowerCaseUsername));
  } catch (error) {
    console.error('Error listing singing records:', error);
    return [];
  }
};
