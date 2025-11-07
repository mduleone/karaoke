'use server';

import { SongType } from '../types/song';
import('harperdb');

export const getSong = async (songId: string): Promise<SongType | null> => {
  try {
    if (typeof tables === 'undefined' || !tables.Songs) {
      return null;
    }
    const { artist, title, favorite, duet, learn, retry, avoid, notes, id, tags, __createdtime__, __updatedtime__ } =
      (await tables.Songs.get(songId)) as unknown as SongType;
    return {
      artist,
      title,
      favorite,
      duet,
      learn,
      retry,
      avoid,
      notes,
      id,
      tags,
      __createdtime__,
      __updatedtime__,
    };
  } catch (error) {
    console.error('Error getting song:', error);
    return null;
  }
};
