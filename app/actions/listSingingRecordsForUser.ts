'use server';

import { RequestTarget } from 'harperdb/resources/RequestTarget';
import { SongType } from '../types/song';
import('harperdb');

export const listSingingRecordsForUser = async (forUser: string) => {
  const lowerCaseUsername = forUser?.toLocaleLowerCase();
  try {
    let songs = [];
    if (tables?.SingingRecord) {
      songs = await Promise.all(
        tables.SingingRecord.search({
          conditions: [{ attribute: 'username', value: lowerCaseUsername, comparator: 'equals' }],
        } as RequestTarget)
          .map(async ({ id, songID, sungAt }) => {
            let artist, title;
            try {
              ({ artist, title } = await tables.Songs.get(songID) as unknown as SongType);
            } catch (e) {
              console.error(`Couldn't find song ${songID}`);
              console.error(e);
            }

            if (artist && title) {
              return {
                id,
                artist,
                title,
                songID,
                sungAt,
              };
            }
          })
          .filter((record) => !!record),
      );
    }
    return Array.from(songs);
  } catch (error) {
    console.error('Error listing songs:', error);
    return [];
  }
};
