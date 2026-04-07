export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { listSongs } from '../actions/listSongs';
import SongList from '../components/SongList';
import { slugToString } from '../utils/string';

export const generateMetadata = async ({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> => {
  const { username } = await params;
  return {
    alternates: {
      types: { 'application/json': `/${username}/songs.json` },
    },
  };
};

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const songs = await listSongs(slugToString(username));

  return <SongList songs={songs} />;
};

export default Page;
