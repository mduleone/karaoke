'use server';

import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { songs, simpleUsers } from '../../db/schema';
import { normalizeUsername } from '../utils/string';

export const deleteSong = async (songId: string, username: string, pin: string) => {
  const lowerCaseUsername = normalizeUsername(username);
  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, lowerCaseUsername)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, message: 'User does not exist!' };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return { statusCode: 403, message: `You're not ${lowerCaseUsername}!` };
  }

  await db.update(songs).set({ deletedAt: new Date() }).where(eq(songs.id, songId));

  updateTag(`user-songs:${lowerCaseUsername}`);
  updateTag(`user-history:${lowerCaseUsername}`);
};
