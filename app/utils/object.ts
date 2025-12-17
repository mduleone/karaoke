export const has = <O extends object, K extends PropertyKey>(obj: O, key: K): obj is O & Record<K, unknown> =>
  Object.hasOwn(obj, key);
