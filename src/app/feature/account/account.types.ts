import { Iterable, Undefined, Unique } from '../../app.types';

export type AccountView = Unique & {
  name: string;
  firstLetter: string;
  avatar?: string;
};

export type AccountSettings = Record<string, string>;
export interface Avatar {
  id: number | Undefined;
  url?: string;
}
export type Account = Iterable & {
  name?: string;
  about?: string;
  previewlyToken: string;
  avatar: Avatar;
  settings: AccountSettings;
};

export type PosibleAccount = Iterable & { name: string; avatar: Avatar };
