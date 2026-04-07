'use server';

import { and, desc, eq, isNull } from 'drizzle-orm';
import { db } from '../../db';
import { singingRecords } from '../../db/schema';

export const listSingingRecordsForSong = async (songId: string, username: string) => {
  const rows = await db
    .select({ id: singingRecords.id, sungAt: singingRecords.sungAt })
    .from(singingRecords)
    .where(and(eq(singingRecords.songId, songId), eq(singingRecords.username, username), isNull(singingRecords.deletedAt)))
    .orderBy(desc(singingRecords.sungAt));

  return rows;
};
