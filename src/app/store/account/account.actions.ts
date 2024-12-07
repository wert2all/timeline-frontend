import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Account } from './account.types';

export const AccountActions = createActionGroup({
  source: 'Account',
  events: {
    'Clean account': emptyProps(),
    'Set account': props<{ account: Account }>(),
  },
});
