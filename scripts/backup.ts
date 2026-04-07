import { config } from 'dotenv';
config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';

async function backup() {
  const { db } = await import('../db');
  const { songs, singingRecords } = await import('../db/schema');

  console.log('Backing up songs...');
  const songsData = await db.select().from(songs);
  fs.writeFileSync(
    path.join(__dirname, 'songs_backup.json'),
    JSON.stringify(songsData, null, 2),
  );
  console.log(`  wrote ${songsData.length} songs`);

  console.log('Backing up singing records...');
  const recordsData = await db.select().from(singingRecords);
  fs.writeFileSync(
    path.join(__dirname, 'singing_records_backup.json'),
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
