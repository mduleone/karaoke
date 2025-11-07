'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { SimpleUserType } from '../types/SimpleUser';
import { createFormDataReader } from './formReader';
import('harperdb');

export const updateSong = async (formData: FormData) => {
  const formDataReader = createFormDataReader(formData);
  const usernameValue = formDataReader('username');
  const pinValue = formDataReader('pin');

  if (typeof usernameValue !== 'string' || !usernameValue.trim() || typeof pinValue !== 'string' || !pinValue.trim()) {
    throw new Error('Username and PIN are required');
  }

  const username = usernameValue.toLocaleLowerCase().trim();
  const pin = pinValue.trim();

  const userRecord = (await tables.SimpleUser.get(username)) as unknown as SimpleUserType;
  if (!userRecord) {
    return { statusCode: 401, status: 'Unauthorized', message: 'User does not exist!' };
  }

  const hash = userRecord.pinHash;
  const pinMatches = await bcrypt.compare(pin, hash);
  if (!pinMatches) {
    return { statusCode: 403, status: 'Access denied', message: `You're not ${username}!` };
  }
  // Extract form values
  const id = formDataReader('id');
  const artistValue = formDataReader('artist');
  const titleValue = formDataReader('title');
  const notesValue = formDataReader('notes');
  const favorite = formDataReader('favorite', true);
  const duet = formDataReader('duet', true);
  const learn = formDataReader('learn', true);
  const retry = formDataReader('retry', true);
  const avoid = formDataReader('avoid', true);

  // Validate required fields
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error('Song ID is required for updates');
  }

  if (typeof artistValue !== 'string' || typeof titleValue !== 'string') {
    throw new Error('Artist and Title are required');
  }

  const artist = artistValue.trim();
  const title = titleValue.trim();
  const notes = typeof notesValue === 'string' ? notesValue : '';

  if (!artist || !title) {
    throw new Error('Artist and Title are required');
  }

  if (typeof tables === 'undefined' || !tables.Songs) {
    throw new Error('Database not available');
  }

  await tables.Songs.put(id, { artist, title, notes, favorite, duet, learn, retry, avoid, username });

  // Revalidate the page to show updated data
  revalidatePath('/');
  revalidatePath('/[username]');

  return { statusCode: 200, status: 'OK' };
}
