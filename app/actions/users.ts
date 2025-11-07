'use server';

import bcrypt from 'bcrypt';
import { SimpleUserType } from '../types/SimpleUser';
import('harperdb');

const saltRounds = 10;

export const login = async (username: string, pin: string) => {
  if (typeof tables === 'undefined' || !tables.SimpleUser) {
    throw new Error('Database not available');
  }
  const lowerCaseUsername = username.toLocaleLowerCase();

  const userRecord = await tables.SimpleUser.get(lowerCaseUsername) as unknown as SimpleUserType;
  if (!userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User does not exist' };
  }

  const hash = userRecord.pinHash;
  const pinMatches = await bcrypt.compare(pin, hash);
  if (!pinMatches) {
    return { statusCode: 401, status: 'Unauthorized', message: 'Invalid username/pin combination' };
  }

  return { statusCode: 200, status: 'OK' };
};

export const createAccount = async (username: string, pin: string) => {
  if (typeof tables === 'undefined' || !tables.SimpleUser) {
    throw new Error('Database not available');
  }
  const lowerCaseUsername = username.toLocaleLowerCase();

  const userRecord = await tables.SimpleUser.get(lowerCaseUsername) as unknown as SimpleUserType;
  if (userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User already exists' };
  }

  const pinHash = await bcrypt.hash(pin, saltRounds);
  await tables.SimpleUser.create({ username: lowerCaseUsername, pinHash }, {});

  return { statusCode: 200, status: 'OK' };
};
