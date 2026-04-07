'use server';

import { isNull } from 'drizzle-orm';
import { db } from '../../db';
import { songs } from '../../db/schema';

export const listAllArtists = async () => {
  try {
    const rows = await db
      .selectDistinct({ artist: songs.artist })
      .from(songs)
      .where(isNull(songs.deletedAt));
    return rows.map((r) => r.artist);
  } catch (error) {
    console.error('Error listing all artists:', error);
    return [];
  }
};
