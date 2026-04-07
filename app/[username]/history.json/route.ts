export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { listSingingRecordsForUser } from '../../actions/listSingingRecordsForUser';
import { slugToString } from '../../utils/string';

export const GET = async (_req: Request, { params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const resolved = slugToString(username);
  const records = await listSingingRecordsForUser(resolved);

  return NextResponse.json({
    username: resolved,
    history: records.map((record) => ({
      artist: record.artist,
      title: record.title,
      sungAt: record.sungAt,
    })),
  });
};
