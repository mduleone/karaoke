'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { SimpleUserType } from '../types/SimpleUser';
import { createFormDataReader } from './formReader';
import('harperdb');

export const createSong = async (formData: FormData) => {
  if (typeof tables === 'undefined' || !tables.Songs || !tables.SimpleUser) {
    throw new Error('Database not available');
  }

  const formDataReader = createFormDataReader(formData);
  const usernameValue = formDataReader('username');
  const pinValue = formDataReader('pin');

  if (typeof usernameValue !== 'string' || !usernameValue.trim() || typeof pinValue !== 'string' || !pinValue.trim()) {
    throw new Error('Username and PIN are required');
  }

  const username = usernameValue.toLocaleLowerCase().trim();
  const pin = pinValue.trim();

  const userRecord = (await tables.SimpleUser.get(username)) as unknown as SimpleUserType;

  if (userRecord) {
    const hash = userRecord.pinHash;
    const pinMatches = await bcrypt.compare(pin, hash);
    if (!pinMatches) {
      return { statusCode: 403, status: 'Access denied', message: `You're not ${username}!` };
    }
  } else {
    return { statusCode: 401, status: 'Unauthorized', message: 'Unauthorized' };
  }

  const artistValue = formDataReader('artist');
  const titleValue = formDataReader('title');
  const notesValue = formDataReader('notes');
  const favorite = formDataReader('favorite', true);
  const duet = formDataReader('duet', true);
  const learn = formDataReader('learn', true);
  const retry = formDataReader('retry', true);
  const avoid = formDataReader('avoid', true);

  if (typeof artistValue !== 'string' || typeof titleValue !== 'string') {
    throw new Error('Artist and Title are required');
  }
  const artist = artistValue.trim();
  const title = titleValue.trim();
  const notes = typeof notesValue === 'string' ? notesValue : '';

  if (!artist || !title) {
    throw new Error('Artist and Title are required');
  }

  await tables.Songs.create(
    {
      artist,
      title,
      notes,
      favorite,
      duet,
      learn,
      retry,
      avoid,
      username,
    },
    {},
  );

  revalidatePath('/');
  revalidatePath('/[username]');

  return { statusCode: 200, status: 'OK' };
};
