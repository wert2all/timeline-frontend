import { Loadable, Undefined } from '../../app.types';
import {
  Account,
  AccountSettings,
} from '../../shared/store/shared/shared.types';

export interface AccountUser {
  id: number;
  name: string | Undefined;
  accounts: Account[];
}

export interface SavingAccountSettings {
  accountId: number;
  name: string;
  avatarId: number | Undefined;
  settings: AccountSettings;
}

export type AccountState = Loadable;
