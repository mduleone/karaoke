import type { Metadata } from 'next';
import { listSingingRecordsForUser } from '../../actions/listSingingRecordsForUser';
import SongHistoryList from '../../components/SongHistoryList';
import { slugToString } from '../../utils/string';

export const generateMetadata = async ({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> => {
  const { username } = await params;
  return {
    alternates: {
      types: { 'application/json': `/${username}/history.json` },
    },
  };
};

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const songs = await listSingingRecordsForUser(slugToString(username));

  return <SongHistoryList songs={songs} />;
};

export default Page;
