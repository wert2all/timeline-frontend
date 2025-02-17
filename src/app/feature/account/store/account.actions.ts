import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Account, AccountSettings } from '../account.types';
import { SavingAccountSettings } from './account.types';

export const AccountActions = createActionGroup({
  source: 'Account',
  events: {
    'Update one setting': props<{
      key: string;
      value: string;
      accountId: number;
      settings: AccountSettings;
    }>(),
    'Empty account settings': emptyProps(),

    'Save account settings': props<{
      accountId: number;
      settings: AccountSettings;
    }>(),
    'Success save account settings': props<{
      accountId: number;
      settings: AccountSettings;
    }>(),

    'Dispatch save account settings': props<{
      settings: SavingAccountSettings;
    }>(),
    'Success save account': props<{ account: Account }>(),

    'Dispatch add new acoount': props<{ name: string }>(),
    'Success add new account': props<{ account: Account }>(),

    'Set active account after init': props<{ account: Account }>(),
    'Set active account after auth': props<{ account: Account }>(),
    'Set active account by user': props<{ account: Account }>(),

    'Upload avatar': props<{
      avatar: { file: File; url: string };
      account: Account;
    }>(),
    'Success upload avatar': props<{ imageId: number }>(),
    'Remove avatar': emptyProps(),

    'Failed upload avatar': emptyProps(),
    'Empty active account': emptyProps(),
    'Error on Init Auth': props<{ error: Error }>(),
    'Empty current account': emptyProps(),
    'Could not add account': emptyProps(),
    'Could not save account settings': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
    'Dispatch empty account error': emptyProps(),
  },
});
