import { Iterable, Undefined } from '../../app.types';
export type AccountSettings = Record<string, string>;

export type AccountUser = {
  id: number;
  name: string | Undefined;
  avatar: string | Undefined;
  accounts: Account[];
};

export type Account = Iterable & {
  name?: string;
  avatar?: string;
  previewlyToken: string;
  settings: AccountSettings;
};

export type AccountState = {
  activeUser: AccountUser | null;
  activeAccount: Account | null;
};
