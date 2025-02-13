import { Loadable, Undefined } from '../../../app.types';
import { Account, AccountSettings } from '../account.types';

export interface SavingAccountSettings {
  accountId: number;
  name: string;
  avatarId: number | Undefined;
  about: string | Undefined;
  settings: AccountSettings;
}

export type AccountState = Loadable & {
  accounts: Account[];
  activeAccount: Account | null;
};
