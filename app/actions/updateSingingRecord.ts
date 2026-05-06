'use server';

import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { singingRecords, simpleUsers } from '../../db/schema';
import { normalizeUsername } from '../utils/string';

export const updateSingingRecord = async (singingRecordId: string, sungAt: Date, username: string, pin: string) => {
  const lowerCaseUsername = normalizeUsername(username);
  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, lowerCaseUsername)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, message: 'User does not exist!' };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return { statusCode: 403, message: `You're not ${lowerCaseUsername}!` };
  }

  await db.update(singingRecords).set({ sungAt }).where(eq(singingRecords.id, singingRecordId));

  updateTag(`user-history:${lowerCaseUsername}`);
};
