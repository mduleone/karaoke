import { listSingingRecordsForUser } from '../../actions/listSingingRecordsForUser';
import SongHistoryList from '../../components/SongHistoryList';
import { slugToString } from '../../utils/string';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const songs = await listSingingRecordsForUser(slugToString(username));
  console.log(songs);

  return <SongHistoryList songs={songs} />;
};

export default Page;
