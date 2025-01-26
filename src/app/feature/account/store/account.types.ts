import { Loadable, Undefined } from '../../../app.types';
import { AccountSettings } from '../account.types';

export interface SavingAccountSettings {
  accountId: number;
  name: string;
  avatarId: number | Undefined;
  settings: AccountSettings;
}

export type AccountState = Loadable;
