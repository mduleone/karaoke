export type SongType = {
  artist: string;
  title: string;
  favorite: boolean;
  duet: boolean;
  learn: boolean;
  retry: boolean;
  avoid: boolean;
  notes: string;
  id: string;
  tags: string[];
  __createdtime__: number;
  __updatedtime__: number;
};

export type SongHistoryType = {
  artist: string;
  title: string;
  id: string;
  sungAt: number;
};

export type ArtistType = {
  artist: string;
  duet: boolean;
  songs: SongType[];
}
