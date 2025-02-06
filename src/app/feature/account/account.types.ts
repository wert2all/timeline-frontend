import { Observable } from 'rxjs';
import { Iterable, Undefined, Unique } from '../../app.types';

export type AccountView = Unique & {
  name: string;
  firstLetter: string;
  avatar?: string;
};

export type AccountSettings = Record<string, string>;
export type Account = Iterable & {
  name?: string;
  previewlyToken: string;
  settings: AccountSettings;
};

export interface AccountsProvigerInterface {
  getAccounts(): Observable<Account[]>;

  getAccount(accountId: number): Observable<Account | Undefined>;
}
