export const normalizeForSearch = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '');

export const stringToSlug = (value?: string): string => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .toLocaleLowerCase()
    .replace(/[^\w\s_-]/g, '')
    .replace(/\s/g, '-');
};
export const slugToString = (slug?: string): string => slug?.replace(/-+/g, ' ') ?? '';

export const normalizeUsername = (value?: string): string => value?.normalize('NFC').trim().toLocaleLowerCase() ?? '';

const LEADING_ARTICLE = /^the\s+/i;

export const stripLeadingArticle = (value?: string): string => value?.replace(LEADING_ARTICLE, '') ?? '';

export const compareArtists = (artistA: string, artistB: string): number => {
  const compare = stripLeadingArticle(artistA).localeCompare(stripLeadingArticle(artistB));
  return compare !== 0 ? compare : artistA.localeCompare(artistB);
};
