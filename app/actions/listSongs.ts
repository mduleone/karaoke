'use server';

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { songs } from '../../db/schema';

export const listSongs = async (forUser?: string) => {
  try {
    const userToSearch = forUser?.toLocaleLowerCase() ?? 'matt';
    return await db.select().from(songs).where(eq(songs.username, userToSearch));
  } catch (error) {
    console.error('Error listing songs:', error);
    return [];
  }
};
