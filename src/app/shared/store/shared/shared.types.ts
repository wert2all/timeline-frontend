import { Account } from '../../../feature/authorized/account/account.types';

export enum CookieCategory {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
}

export interface SharedState {
  cookie: CookieCategory[];
  activeAccount: Account | null;
}
