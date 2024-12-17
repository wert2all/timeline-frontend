import { Iterable, Loadable } from '../../app.types';
import { Account } from '../account/account.types';

export type AuthorizedUser = Iterable & {
  email: string;
  accounts: Account[];
};

export type AuthState = Loadable & {
  authorizedUser: AuthorizedUser | null;
};
