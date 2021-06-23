import { DeepReadonly, InjectionKey, Ref } from 'vue';

export type ReadonlyRef<T> = DeepReadonly<Ref<T>>;
export function ReadonlyRefInjectionKey<T>(): InjectionKey<ReadonlyRef<T>> {
  return Symbol();
}

export type ExtractArrayMaybe<T extends readonly (unknown | null)[]> =
  NonNullable<T[number]>;
