export * from './types';

export type ExtractArrayMaybe<T extends readonly (unknown | null)[]> =
  NonNullable<T[number]>;
