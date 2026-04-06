'use server';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { simpleUsers } from '../../db/schema';

const saltRounds = 10;

export const login = async (username: string, pin: string) => {
  const lowerCaseUsername = username.toLocaleLowerCase();

  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, lowerCaseUsername)).limit(1);
  if (!userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User does not exist' };
  }

  const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
  if (!pinMatches) {
    return { statusCode: 401, status: 'Unauthorized', message: 'Invalid username/pin combination' };
  }

  return { statusCode: 200, status: 'OK' };
};

export const createAccount = async (username: string, pin: string) => {
  const lowerCaseUsername = username.toLocaleLowerCase();

  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, lowerCaseUsername)).limit(1);
  if (userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User already exists' };
  }

  const passwordHash = await bcrypt.hash(pin, saltRounds);
  await db.insert(simpleUsers).values({ username: lowerCaseUsername, passwordHash });

  return { statusCode: 200, status: 'OK' };
};
