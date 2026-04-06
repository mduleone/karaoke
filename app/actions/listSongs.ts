'use server';

const listSongsServer = async (forUser) => {
  try {
    let songs = [];
    if (tables?.Songs) {
      const userToSearch = forUser ? forUser : 'matt';

      songs = await tables.Songs.search({
        conditions: [{ attribute: 'username', value: userToSearch, comparator: 'equals' }],
      })
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
  return await listSongsServer(lowerCaseUsername);
};
