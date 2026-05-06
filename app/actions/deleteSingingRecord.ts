'use server';

import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { singingRecords, simpleUsers } from '../../db/schema';
import { normalizeUsername } from '../utils/string';

export const deleteSingingRecord = async (singingRecordId: string, username: string, pin: string) => {
  const lowerCaseUsername = normalizeUsername(username);
  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, lowerCaseUsername)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, error: new Error(`User does not exist!`) };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return { statusCode: 403, error: new Error(`You're not ${lowerCaseUsername}!`) };
  }

  await db.update(singingRecords).set({ deletedAt: new Date() }).where(eq(singingRecords.id, singingRecordId));

  updateTag(`user-history:${lowerCaseUsername}`);
};
