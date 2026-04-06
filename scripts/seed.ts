import { config } from 'dotenv';
config({ path: '.env.local' });

const songsBackup = require('./songs_backup.json');
const usersBackup = require('./simple_user_backup.json');
const recordsBackup = require('./singing_records_backup.json');

async function seed() {
  const { db } = await import('../db');
  const { songs, simpleUsers, singingRecords } = await import('../db/schema');
  console.log('Seeding users...');
  await db.insert(simpleUsers).values(
    usersBackup.map(({ username, pinHash, createdAt }) => ({
      username,
      passwordHash: pinHash,
      createdAt: new Date(createdAt),
    })),
  );
  console.log(`  inserted ${usersBackup.length} users`);

  console.log('Seeding songs...');
  await db.insert(songs).values(
    songsBackup.map(({ id, username, artist, title, favorite, duet, learn, retry, avoid, notes, __createdtime__, __updatedtime__ }) => ({
      id,
      username,
      artist,
      title,
      favorite: favorite ?? false,
      duet: duet ?? false,
      learn: learn ?? false,
      retry: retry ?? false,
      avoid: avoid ?? false,
      notes: notes ?? '',
      tags: [],
      createdAt: new Date(__createdtime__),
      updatedAt: new Date(__updatedtime__),
    })),
  );
  console.log(`  inserted ${songsBackup.length} songs`);

  console.log('Seeding singing records...');
  await db.insert(singingRecords).values(
    recordsBackup.map(({ id, songID, songName, songArtist, username, sungAt }) => ({
      id,
      songId: songID,
      songName,
      songArtist,
      username,
      sungAt: new Date(sungAt),
    })),
  );
  console.log(`  inserted ${recordsBackup.length} singing records`);

  console.log('Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
