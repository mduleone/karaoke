'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { singingRecords, simpleUsers } from '../../db/schema';

export const updateSingingRecord = async (singingRecordId: string, sungAt: Date, username: string, pin: string) => {
  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, username)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, message: 'User does not exist!' };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return { statusCode: 403, message: `You're not ${username}!` };
  }

  await db.update(singingRecords).set({ sungAt }).where(eq(singingRecords.id, singingRecordId));

  revalidatePath('/[username]/history');
};
