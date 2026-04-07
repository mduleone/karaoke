'use server';

import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../db';
import { songs } from '../../db/schema';

export const listSongIdentifiersForUser = async (username: string) => {
  try {
    return await db
      .select({ artist: songs.artist, title: songs.title })
      .from(songs)
      .where(and(eq(songs.username, username), isNull(songs.deletedAt)));
  } catch (error) {
    console.error('Error listing song identifiers:', error);
    return [];
  }
};
