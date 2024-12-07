import { createActionGroup, props } from '@ngrx/store';
import { Account } from './account.types';

export const AccountActions = createActionGroup({
  source: 'Account',
  events: {
    'Set account': props<{ account: Account }>(),
  },
});
