import { listSongs } from '../actions';
import SongList from '../components/SongList';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
	const { username } = await params;
	const songs = await listSongs(username);

	return <SongList songs={songs} />;
};

export default Page;
