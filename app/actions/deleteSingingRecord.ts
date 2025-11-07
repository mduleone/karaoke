'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { SimpleUserType } from '../types/SimpleUser';
import('harperdb');

const saltRounds = 10;

export const deleteSingingRecord = async (singingRecordId: string, username: string, pin: string) =>{
  if (typeof tables === 'undefined' || !tables.SingingRecord || !tables.SimpleUser) {
    throw new Error('Database not available');
  }

  const userRecord = await tables.SimpleUser.get(username) as unknown as SimpleUserType;
  if (!userRecord) {
    return { statusCode: 401, error: new Error(`User does not exist!`) };
  }

  const hash = userRecord.pinHash;
  const pinMatches = await bcrypt.compare(pin, hash);
  if (!pinMatches) {
    return { statusCode: 403, error: new Error(`You're not ${username}!`) };
  }

  await tables.SingingRecord.delete(singingRecordId);

  revalidatePath('/[username]/history');
};