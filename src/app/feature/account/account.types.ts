import { Iterable, Undefined, Unique } from '../../app.types';

export interface AvatarView {
  small: string;
  full: string;
}

export type AccountView = Unique & {
  name: string;
  firstLetter: string;
  avatar?: AvatarView;
};

export type AccountSettings = Record<string, string>;
export interface Avatar {
  id: number | Undefined;
  small?: string;
  full?: string;
}
export type Account = Iterable & {
  name?: string;
  about?: string;
  previewlyToken: string;
  avatar: Avatar;
  settings: AccountSettings;
};

export type PosibleAccount = Iterable & { name: string; avatar: Avatar };
