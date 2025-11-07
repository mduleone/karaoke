import { listSongs } from './actions/listSongs';
import SongList from './components/SongList';

export default async function Page() {
  const songs = await listSongs();

  return (
    <SongList songs={songs} />
  );
}
