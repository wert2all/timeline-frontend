import { Iterable, Loadable, Undefined } from '../../app.types';
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

export interface SavingAccountSettings {
  accountId: number;
  name: string;
  avatarId: number | Undefined;
  settings: AccountSettings;
}

export type AccountState = Loadable & {
  activeUser: AccountUser | null;
  activeAccount: Account | null;
};
