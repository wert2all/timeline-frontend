import { Loadable, MaybeWithError, Undefined } from '../../../app.types';
import { Account, AccountSettings, ShortAccount } from '../account.types';

export const UserAccountsKey = 'userAccounts';

export interface SavingAccountSettings {
  accountId: number;
  name: string;
  avatarId: number | Undefined;
  about: string | Undefined;
  settings: AccountSettings;
}

export type CurrentAvatarUpload = Loadable &
  MaybeWithError & { previewUrl?: string; imageId?: number };

export type AccountState = Loadable & {
  [UserAccountsKey]: ShortAccount[];
  activeAccount: Account | null;
  accounts: Record<number, ShortAccount>;
  currentAvatarUpload: Undefined | CurrentAvatarUpload;
};
