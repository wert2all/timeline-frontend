import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { StoreDispatchEffect } from '../../../../app.types';
import { TokenProvider } from '../../../auth/shared/token.provider';
import { CurrentAccountProvider } from '../../current.provider';
import { AccountsService } from '../../share/accounts.service';
import { AccountActions } from '../account.actions';
import { accountFeature } from '../account.reducer';

export const initStateEffects = {
  init: createEffect(
    (
      actions$ = inject(Actions),
      tokenProvider = inject(TokenProvider),
      currentAccountIdProvider = inject(CurrentAccountProvider),
      store = inject(Store),
      accountsService = inject(AccountsService)
    ) => {
      return actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        concatLatestFrom(() => store.select(accountFeature.selectAccounts)),
        map(([, accounts]) => {
          if (tokenProvider.getToken()) {
            const currentAccountId =
              currentAccountIdProvider.getActiveAccountId();
            const firstAccount = accounts.slice(0, 1)[0];
            if (currentAccountId) {
              return accounts.find(a => a.id === currentAccountId)
                ? currentAccountId
                : firstAccount?.id;
            } else {
              return firstAccount?.id;
            }
          } else {
            return null;
          }
        }),
        exhaustMap(currentAccountId =>
          currentAccountId
            ? accountsService
                .getAccounts()
                .pipe(
                  map(accounts =>
                    accounts.find(account => account?.id == currentAccountId)
                  )
                )
            : of(null)
        ),
        map(account =>
          account
            ? AccountActions.setActiveAccountAfterInit({ account })
            : AccountActions.emptyActiveAccount()
        ),
        catchError(err => of(AccountActions.errorOnInitAuth({ error: err })))
      );
    },
    StoreDispatchEffect
  ),
};
