'use server';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { singingRecords, simpleUsers } from '../../db/schema';

export const singSong = async (songID: string, songArtist: string, songName: string, username: string, pin: string) => {
  const lowerCaseUsername = username?.toLocaleLowerCase();

  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, lowerCaseUsername)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User does not exist!' };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return {
      statusCode: 403,
      status: 'Access Denied',
      message: `Error recording singing ${songArtist} - ${songName}`,
    };
  }

  await db.insert(singingRecords).values({
    songId: songID,
    songName,
    songArtist,
    username: lowerCaseUsername,
    sungAt: new Date(),
  });

  return { statusCode: 200, status: 'OK' };
};
