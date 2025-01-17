import { Iterable, Undefined } from '../../app.types';
export type AccountSettings = Record<string, string>;

export interface AccountUser {
  id: number;
  name: string | Undefined;
  avatar: string | Undefined;
  accounts: Account[];
}

export type Account = Iterable & {
  name?: string;
  avatar?: string;
  previewlyToken: string;
  settings: AccountSettings;
};

export interface AccountState {
  activeUser: AccountUser | null;
  activeAccount: Account | null;
}
