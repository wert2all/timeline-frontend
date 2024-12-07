import { Iterable } from '../../app.types';
export type AccountSettings = Record<string, string>;

export type Account = Iterable & {
  name?: string;
  avatar?: string;
  settings: AccountSettings;
};

export type AccountState = {
  activeAccount: Account | null;
};
