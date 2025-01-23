import { Observable } from 'rxjs';
import { Iterable, Undefined } from '../../app.types';

export type AccountSettings = Record<string, string>;
export type Account = Iterable & {
  name?: string;
  previewlyToken: string;
  settings: AccountSettings;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAccount = (maybeAccount: any): maybeAccount is Account => {
  return (
    'id' in maybeAccount &&
    'previewlyToken' in maybeAccount &&
    'settings' in maybeAccount
  );
};

export interface AccountsProvigerInterface {
  getAccounts(): Observable<Account[]>;
  getAccount(accountId: number): Observable<Account | Undefined>;
}
