import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Account,
  AccountSettings,
} from '../../feature/authorized/account/account.types';
import { SavingAccountSettings } from './account.types';

export const AccountActions = createActionGroup({
  source: 'Account',
  events: {
    'Update one setting': props<{ key: string; value: string }>(),
    'Empty account settings': emptyProps(),

    'Save account settings': props<{
      accountId: number;
      settings: AccountSettings;
    }>(),
    'Success save account settings': emptyProps(),

    'Dispatch save account settings': props<{
      settings: SavingAccountSettings;
    }>(),
    'Success save account': props<{ account: Account }>(),

    'Could not save account settings': emptyProps(),
    'Api Exception': props<{ exception: string }>(),
    'Dispatch empty account error': emptyProps(),
  },
});
