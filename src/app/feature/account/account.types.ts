import { Iterable, Unique } from '../../app.types';

export type AccountView = Unique & {
  name: string;
  firstLetter: string;
  avatar?: string;
};

export type AccountSettings = Record<string, string>;
export type Account = Iterable & {
  name?: string;
  about?: string;
  previewlyToken: string;
  settings: AccountSettings;
};
