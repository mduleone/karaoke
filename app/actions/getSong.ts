'use server';

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { songs } from '../../db/schema';
import { SongType } from '../types/song';

export const getSong = async (songId: string): Promise<SongType | null> => {
  try {
    const [song] = await db.select().from(songs).where(eq(songs.id, songId)).limit(1);
    return song ?? null;
  } catch (error) {
    console.error('Error getting song:', error);
    return null;
  }
};
