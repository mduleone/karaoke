export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { listSongs } from '../../actions/listSongs';
import { slugToString } from '../../utils/string';

export const GET = async (_req: Request, { params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const resolved = slugToString(username);
  const songs = await listSongs(resolved);

  return NextResponse.json({
    username: resolved,
    songs: songs.map((song) => ({
      artist: song.artist,
      title: song.title,
      notes: song.notes || null,
      tags: [
        ...(song.favorite ? ['favorite'] : []),
        ...(song.duet ? ['duet'] : []),
        ...(song.learn ? ['learn'] : []),
        ...(song.retry ? ['retry'] : []),
        ...(song.avoid ? ['avoid'] : []),
        ...song.tags,
      ],
      addedAt: song.createdAt,
    })),
  });
};
