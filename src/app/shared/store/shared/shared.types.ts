import { Iterable } from '../../../app.types';

export enum CookieCategory {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
}

export type AccountSettings = Record<string, string>;
export type Account = Iterable & {
  name?: string;
  previewlyToken: string;
  settings: AccountSettings;
};

export interface SharedState {
  cookie: CookieCategory[];
  activeAccount: Account | null;
}
