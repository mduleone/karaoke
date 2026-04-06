require('dotenv').config();
const path = require('path');
const fs = require('fs');

const baseUrl = 'https://app.karaoke.harperfabric.com/';
const songsUrl = `${baseUrl}Songs/`;
const singingRecordsUrl = `${baseUrl}SingingRecord/`;
const simpleUserUrl = `${baseUrl}SimpleUser/`;

async function fetchSongs() {
  const songs = await fetchWithAuth(songsUrl);

  // write the songs to a local file
  fs.writeFileSync(path.join(__dirname, 'songs_backup.json'), JSON.stringify(songs, null, 2));
}
async function fetchSingingRecords() {
  const singingRecords = await fetchWithAuth(singingRecordsUrl);

  // write the singing records to a local file
  fs.writeFileSync(path.join(__dirname, 'singing_records_backup.json'), JSON.stringify(singingRecords, null, 2));
}
async function fetchSimpleUser() {
  const simpleUser = await fetchWithAuth(simpleUserUrl);

  // write the simple user to a local file
  fs.writeFileSync(path.join(__dirname, 'simple_user_backup.json'), JSON.stringify(simpleUser, null, 2));
}

async function fetchWithAuth(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${btoa(`${process.env.CLI_TARGET_USERNAME}:${process.env.CLI_TARGET_PASSWORD}`)}`,
    },
  });
  return response.json();
}

async function backup() {
  try {
    await fetchSongs();
    await fetchSingingRecords();
    await fetchSimpleUser();
    console.log('Backup completed successfully!');
  } catch (error) {
    console.error('Error during backup:', error);
  }
}

backup();
