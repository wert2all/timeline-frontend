import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ShortAccount, User } from '../../api/internal/graphql';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init authorized user': props<{ token: string }>(),

    'Prompt Login': emptyProps(),
    'Set user token': props<{ token: string }>(),

    'Show select account window': props<{ accounts: ShortAccount[] }>(),

    'Dispatch logout': emptyProps(),
    'Clean auth state': emptyProps(),

    'Success Authorized': props<{
      account: ShortAccount;
      user: User;
      token: string;
    }>(),

    'Empty accounts': props<{ email: string }>(),
    'Dispatch auth error': props<{ error: string }>(),
  },
});
