import { Loadable, MaybeWithError, Undefined } from '../../../app.types';
import { Account, AccountSettings, PosibleAccount } from '../account.types';

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
  userAccounts: PosibleAccount[];
  activeAccount: Account | null;
  currentAvatarUpload: Undefined | CurrentAvatarUpload;
};
