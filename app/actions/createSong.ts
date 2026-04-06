'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { db } from '../../db';
import { songs, simpleUsers } from '../../db/schema';
import { createFormDataReader } from './formReader';

export const createSong = async (formData: FormData) => {
  const formDataReader = createFormDataReader(formData);
  const usernameValue = formDataReader('username');
  const pinValue = formDataReader('pin');

  if (typeof usernameValue !== 'string' || !usernameValue.trim() || typeof pinValue !== 'string' || !pinValue.trim()) {
    throw new Error('Username and PIN are required');
  }

  const username = usernameValue.toLocaleLowerCase().trim();
  const pin = pinValue.trim();

  const [userRecord] = await db.select().from(simpleUsers).where(eq(simpleUsers.username, username)).limit(1);

  if (userRecord) {
    const pinMatches = await bcrypt.compare(pin, userRecord.passwordHash);
    if (!pinMatches) {
      return { statusCode: 403, status: 'Access denied', message: `You're not ${username}!` };
    }
  } else {
    return { statusCode: 401, status: 'Unauthorized', message: 'Unauthorized' };
  }

  const artistValue = formDataReader('artist');
  const titleValue = formDataReader('title');
  const notesValue = formDataReader('notes');
  const favorite = formDataReader('favorite', true) as boolean;
  const duet = formDataReader('duet', true) as boolean;
  const learn = formDataReader('learn', true) as boolean;
  const retry = formDataReader('retry', true) as boolean;
  const avoid = formDataReader('avoid', true) as boolean;

  if (typeof artistValue !== 'string' || typeof titleValue !== 'string') {
    throw new Error('Artist and Title are required');
  }
  const artist = artistValue.trim();
  const title = titleValue.trim();
  const notes = typeof notesValue === 'string' ? notesValue : '';

  if (!artist || !title) {
    throw new Error('Artist and Title are required');
  }

  await db.insert(songs).values({ artist, title, notes, favorite, duet, learn, retry, avoid, username });

  revalidatePath('/');
  revalidatePath('/[username]');

  return { statusCode: 200, status: 'OK' };
};
