'use server';

import bcrypt from 'bcrypt';
import { SimpleUserType } from '../types/SimpleUser';
import('harperdb');

export const singSong = async (songID: string, songArtist: string, songName: string, username: string, pin: string) => {
  const lowerCaseUsername = username?.toLocaleLowerCase();

  if (typeof tables === 'undefined' || !tables.SingingRecord || !tables.SimpleUser) {
    throw new Error('Database not available');
  }

  const userRecord = (await tables.SimpleUser.get(lowerCaseUsername)) as unknown as SimpleUserType;
  if (!userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User does not exist!' };
  }

  const hash = userRecord.pinHash;
  const pinMatches = await bcrypt.compare(pin, hash);
  if (!pinMatches) {
    return {
      statusCode: 403,
      status: 'Access Denied',
      message: `Error recording singing ${songArtist} - ${songName}`,
    };
  }

  const sungAt = Date.now();

  await tables.SingingRecord.create(
    {
      songID,
      songName,
      songArtist,
      username: lowerCaseUsername,
      sungAt,
    },
    {},
  );

  return { statusCode: 200, status: 'OK' };
};
