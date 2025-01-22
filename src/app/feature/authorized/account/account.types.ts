import { Iterable } from '../../../app.types';

export type AccountSettings = Record<string, string>;
export type Account = Iterable & {
  name?: string;
  previewlyToken: string;
  settings: AccountSettings;
};
