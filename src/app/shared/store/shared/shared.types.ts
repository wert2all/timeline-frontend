import { Account } from '../../../feature/authorized/account/account.types';

export enum CookieCategory {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
}

export type AccountWithSettings = Account & {
  settings: Record<string, string>;
};

export interface SharedState {
  cookie: CookieCategory[];
  activeAccount: AccountWithSettings | null;
}
