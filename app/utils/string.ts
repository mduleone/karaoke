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
