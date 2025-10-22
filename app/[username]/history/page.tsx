import { listSingingRecordsForUser } from '../../actions';
import SongHistoryList from '../../components/SongHistoryList';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const songs = await listSingingRecordsForUser(username);

	return <SongHistoryList songs={songs} />;
};

export default Page;
