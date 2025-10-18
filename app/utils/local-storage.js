export const getItem = (key) => {
  if (typeof window === 'undefined' || !window || !window.localStorage) {
    return null;
  }

  const rawValue = window.localStorage.getItem(key);
  return rawValue
    ? JSON.parse(rawValue)
    : '';
};

export const setItem = (key, blob) => {
  if (typeof window === 'undefined' || !window || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify(blob),
  );
};
