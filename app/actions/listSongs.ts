'use server';

import { Condition } from 'harperdb/resources/ResourceInterface';
import { RequestTarget } from 'harperdb/resources/RequestTarget';
import('harperdb');

const CLUSTER_URL_FOR_SONGS = 'https://karaoke-cluster.karaoke.harperfabric.com:9926/Songs/';

const listSongsLocalBuild = async (forUser) => {
  try {
    const songsFetch = await fetch(CLUSTER_URL_FOR_SONGS, { method: 'GET' });
    const songsRaw = await songsFetch.json();

    const songs = songsRaw.filter(({ username, artist, title }) => {
      const shouldRenderSongForUser = forUser ? username === forUser : username === 'matt';
      return !!artist && !!title && shouldRenderSongForUser;
    });

    return songs;
  } catch (error) {
    console.error('Error listing songs:', error);
    return [];
  }
};

const listSongsServer = async (forUser) => {
  try {
    let songs = [];
    if (tables?.Songs) {
      const userToSearch = forUser ? forUser : 'matt';

      songs = await tables.Songs.search({
        conditions: [{ attribute: 'username', value: userToSearch, comparator: 'equals' } as Condition],
      } as RequestTarget)
        .map(
          ({
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
          }) => ({
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
          }),
        )
        .filter(({ artist, title }) => !!artist && !!title);
    }
    return Array.from(songs);
  } catch (error) {
    console.error('Error listing songs:', error);
    return [];
  }
};

export const listSongs = async (forUser) => {
  const lowerCaseUsername = forUser?.toLocaleLowerCase();
  if (process.env.LOCAL_BUILD_FOR_DEPLOY === 'true') {
    return await listSongsLocalBuild(lowerCaseUsername);
  }

  return await listSongsServer(lowerCaseUsername);
};
