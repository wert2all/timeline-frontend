import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, tap } from 'rxjs';
import {
  StoreDispatchEffect,
  StoreUnDispatchEffect,
} from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { CurrentAccountProvider } from '../../current.provider';
import { AccountsService } from '../../share/accounts.service';
import { AccountActions } from '../account.actions';

export const setActiveAccount = {
  switchAccountByUser: createEffect(
    (actions$ = inject(Actions), accountService = inject(AccountsService)) => {
      return actions$.pipe(
        ofType(SharedActions.switchActiveAccount),
        exhaustMap(({ account }) =>
          accountService
            .getAccounts()
            .pipe(map(accounts => accounts.find(acc => acc?.id == account.id)))
        ),
        map(account =>
          account
            ? AccountActions.setActiveAccountByUser({ account })
            : AccountActions.emptyActiveAccount()
        )
      );
    },
    StoreDispatchEffect
  ),
  saveActiveAccountIdToCache: createEffect(
    (
      actions$ = inject(Actions),
      currentAccountProvider = inject(CurrentAccountProvider)
    ) => {
      return actions$.pipe(
        ofType(
          AccountActions.successAddNewAccount,
          AccountActions.setActiveAccountAfterInit,
          AccountActions.setActiveAccountAfterAuth,
          AccountActions.setActiveAccountByUser
        ),
        tap(({ account }) => {
          currentAccountProvider.setActiveAccountId(account);
        })
      );
    },
    StoreUnDispatchEffect
  ),
};
