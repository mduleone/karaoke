import { config } from 'dotenv';
config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';

async function backup() {
  const { db } = await import('../db');
  const { songs, singingRecords } = await import('../db/schema');

  console.log('Backing up songs...');
  const songsData = await db.select().from(songs);
  songsData.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
  fs.writeFileSync(
    path.join(process.cwd(), 'songs_backup.json'),
    JSON.stringify(songsData, null, 2),
  );
  console.log(`  wrote ${songsData.length} songs`);

  console.log('Backing up singing records...');
  const recordsData = await db.select().from(singingRecords);
  recordsData.sort((a, b) => new Date(a.sungAt).getTime() - new Date(b.sungAt).getTime());
  fs.writeFileSync(
    path.join(process.cwd(), 'singing_records_backup.json'),
    JSON.stringify(recordsData, null, 2),
  );
  console.log(`  wrote ${recordsData.length} singing records`);

  console.log('Backup completed successfully!');
  process.exit(0);
}

backup().catch((err) => {
  console.error('Error during backup:', err);
  process.exit(1);
});
