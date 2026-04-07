'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { singingRecords, simpleUsers } from '../../db/schema';

export const deleteSingingRecord = async (singingRecordId: string, username: string, pin: string) => {
  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, username)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, error: new Error(`User does not exist!`) };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return { statusCode: 403, error: new Error(`You're not ${username}!`) };
  }

  await db.update(singingRecords).set({ deletedAt: new Date() }).where(eq(singingRecords.id, singingRecordId));

  revalidatePath('/[username]/history');
};
