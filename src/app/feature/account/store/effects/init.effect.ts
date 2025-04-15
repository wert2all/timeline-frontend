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
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { TokenProvider } from '../../../auth/shared/token.provider';
import { PosibleAccount } from '../../account.types';
import { CurrentAccountProvider } from '../../current.provider';
import { AccountsService } from '../../share/accounts.service';
import { AccountActions } from '../account.actions';
import { accountFeature } from '../account.reducer';

const getCurentAccountId = (
  accounts: PosibleAccount[],
  tokenProvider: TokenProvider,
  currentAccountIdProvider: CurrentAccountProvider
) => {
  if (tokenProvider.getToken()) {
    const currentAccountId = currentAccountIdProvider.getActiveAccountId();
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
};

const getAccount = (
  currentAccountId: number | null,
  accountsService: AccountsService
) =>
  currentAccountId
    ? accountsService
        .getAccounts()
        .pipe(
          map(accounts =>
            accounts.find(account => account?.id == currentAccountId)
          )
        )
    : of(null);

export const initStateEffects = {
  initStore: createEffect(
    (
      actions$ = inject(Actions),
      store = inject(Store),
      tokenProvider = inject(TokenProvider),
      currentAccountIdProvider = inject(CurrentAccountProvider),
      accountsService = inject(AccountsService)
    ) => {
      return actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        concatLatestFrom(() => store.select(accountFeature.selectUserAccounts)),
        map(([, accounts]) =>
          getCurentAccountId(accounts, tokenProvider, currentAccountIdProvider)
        ),
        exhaustMap(currentAccountId =>
          getAccount(currentAccountId, accountsService)
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

  setActiveAccountAfterAuth: createEffect(
    (
      actions$ = inject(Actions),
      tokenProvider = inject(TokenProvider),
      currentAccountIdProvider = inject(CurrentAccountProvider),
      accountsService = inject(AccountsService)
    ) => {
      return actions$.pipe(
        ofType(SharedActions.successAuthenticated),
        map(({ accounts }) =>
          getCurentAccountId(accounts, tokenProvider, currentAccountIdProvider)
        ),
        exhaustMap(currentAccountId =>
          getAccount(currentAccountId, accountsService)
        ),
        map(current =>
          current
            ? AccountActions.setActiveAccountAfterAuth({ account: current })
            : AccountActions.emptyCurrentAccount()
        ),
        catchError(err => {
          console.log(err);
          return of(AccountActions.errorOnInitAuth({ error: err }));
        })
      );
    },
    StoreDispatchEffect
  ),
};
