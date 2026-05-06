export const normalizeForSearch = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '');

export const stringToSlug = (value?: string): string =>{
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .toLocaleLowerCase()
    .replace(/[^\w\s_-]/g, '')
    .replace(/\s/g, '-');
}
export const slugToString = (slug?: string): string => slug?.replace(/-+/g, ' ') ?? '';

export const normalizeUsername = (value?: string): string =>
  value?.normalize('NFC').trim().toLocaleLowerCase() ?? '';
