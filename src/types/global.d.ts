declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ReturnType<T> = T extends (...args: any[]) => infer U ? U : never;

  type EntriesOfUnion<T> = T extends T ? [keyof T, T[keyof T]] : never;
  type KeysOfUnion<T> = T extends T ? keyof T : never;
  type ValuesOfUnion<T> = T extends T ? T[keyof T] : never;

  type Arrayable<T> = T | T[];
  type Maybe<T> = T | null;
  type NonEmptyArray<T> = [T, ...T[]];
  type NonUndefined<T> = T extends undefined ? never : T;

  type EitherOr<A, B> =
    | (A & Partial<Record<Exclude<keyof B, keyof A>, never>>)
    | (B & Partial<Record<Exclude<keyof A, keyof B>, never>>);
  type Mutable<I extends object> = { -readonly [key in keyof I]: I[key] };
  type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

  type PartialAtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
  type OneOf<T> = { [K in keyof T]-?: Pick<T, K> & Partial<T> }[keyof T];
  type OnlyOneKey<T> = {
    [K in keyof T]: { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: never };
  }[keyof T];
  type ValueOf<T> = T[keyof T];

  interface ObjectConstructor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromEntries<K extends PropertyKey, T = any>(
      entries: Iterable<readonly [K, T]>,
    ): { [k in K]: T };
    entries<O extends object>(o: O): EntriesOfUnion<O>[];
    keys<O extends object>(o: O): KeysOfUnion<O>[];
    values<O extends object>(o: O): ValuesOfUnion<O>[];
  }
}

export {};
