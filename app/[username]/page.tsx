import { listSongs } from '../actions/listSongs';
import SongList from '../components/SongList';
import { slugToString } from '../utils/string';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const songs = await listSongs(slugToString(username));

  return <SongList songs={songs} />;
};

export default Page;
