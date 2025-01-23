import { Iterable } from '../../app.types';

export interface LocalStorageAccount {
  id: string;
  name: string;
  avatar?: string;
  previewlyToken: string;
}

export type Account = Iterable & Omit<LocalStorageAccount, 'id'>;

export function asLocalStorageAccount(
  account: unknown
): LocalStorageAccount | null {
  return (account as LocalStorageAccount).id != undefined &&
    (account as LocalStorageAccount).name != undefined &&
    (account as LocalStorageAccount).previewlyToken != undefined
    ? (account as LocalStorageAccount)
    : null;
}
