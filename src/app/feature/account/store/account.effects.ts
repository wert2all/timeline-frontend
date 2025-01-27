import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AccountSettingInput, ApiClient } from '../../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';

import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import {
  mergeAccountSettings,
  sharedFeature,
} from '../../../shared/store/shared/shared.reducers';
import { ModalWindowActions } from '../../ui/layout/store/modal-window/modal-window.actions';
import { Account } from '../account.types';
import { CurrentAccountProvider } from '../current.provider';
import { CachedAccountsProvider } from '../storage/cached-accounts.provider';
import { AccountActions } from './account.actions';

const updateOneSettings = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(AccountActions.updateOneSetting),
    concatLatestFrom(() => store.select(sharedFeature.selectActiveAccount)),
    map(([{ key, value }, acc]) => mergeAccountSettings(acc, { key, value })),
    map(account =>
      account && account.settings
        ? AccountActions.saveAccountSettings({
            accountId: account.id,
            settings: account.settings,
          })
        : AccountActions.emptyAccountSettings()
    )
  );
const saveAccountSettings = (
  actions$ = inject(Actions),
  api = inject(ApiClient)
) =>
  actions$.pipe(
    ofType(AccountActions.saveAccountSettings),
    map(action => {
      const settings: AccountSettingInput[] = [];
      Object.entries(action.settings).forEach(([key, value]) => {
        settings.push({ key, value });
      });
      return {
        accountId: action.accountId,
        settings: settings,
      };
    }),
    exhaustMap(({ accountId, settings }) =>
      api
        .saveAccountSettings({
          accountId: accountId,
          settings: settings,
        })
        .pipe(
          map(result =>
            result.data?.saveSettings == 'success'
              ? AccountActions.successSaveAccountSettings()
              : AccountActions.couldNotSaveAccountSettings()
          )
        )
    ),
    catchError(err => of(AccountActions.apiException({ exception: err })))
  );

const successSaveAccountSettings = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.successSaveAccountSettings),
    map(() =>
      SharedActions.sendNotification({
        message: 'Account settings saved',
        withType: 'success',
      })
    )
  );

const couldNotSaveAccountSettings = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.couldNotSaveAccountSettings),
    map(() =>
      SharedActions.sendNotification({
        message: 'Could not save account settings',
        withType: 'error',
      })
    )
  );

const apiException = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.apiException),
    map(({ exception }) =>
      SharedActions.sendNotification({
        message: exception,
        withType: 'error',
      })
    )
  );

const dispatchLogoutOnEmptyAccount = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.dispatchEmptyAccountError),
    map(() => SharedActions.logout())
  );

const saveAccount = (actions$ = inject(Actions), api = inject(ApiClient)) =>
  actions$.pipe(
    ofType(AccountActions.dispatchSaveAccountSettings),
    exhaustMap(({ settings }) =>
      api
        .saveAccount({
          accountId: settings.accountId,
          account: {
            name: settings.name,
            avatarID: settings.avatarId,
          },
        })
        .pipe(
          map(result =>
            apiAssertNotNull(extractApiData(result)?.account, 'Empty account')
          ),
          map(
            (acc): Account => ({
              id: acc.id,
              name: acc.name || undefined,
              previewlyToken: acc.previewlyToken,
              settings: acc.settings.reduce(
                (acc, setting) => ({
                  ...acc,
                  [setting.key]: setting.value,
                }),
                {}
              ),
            })
          )
        )
    ),
    map(account => AccountActions.successSaveAccount({ account: account })),
    catchError(err => of(AccountActions.apiException({ exception: err })))
  );

const updateAccountCacheAfterSaveAccount = (
  actions$ = inject(Actions),
  cachedAccountProvider = inject(CachedAccountsProvider)
) =>
  actions$.pipe(
    ofType(AccountActions.successSaveAccount),
    tap(({ account }) => {
      cachedAccountProvider.upsetAccount(account);
    })
  );

const addNewAccount = (actions$ = inject(Actions), api = inject(ApiClient)) =>
  actions$.pipe(
    ofType(AccountActions.dispatchAddNewAcoount),
    exhaustMap(({ name }) =>
      api
        .addAccount({ name })
        .pipe(
          map(result =>
            apiAssertNotNull(
              extractApiData(result)?.account,
              'Could not add account'
            )
          )
        )
    ),
    map(
      (account): Account => ({
        id: account.id,
        name: account.name || undefined,
        previewlyToken: account.previewlyToken,
        settings: account.settings.reduce(
          (acc, setting) => ({
            ...acc,
            [setting.key]: setting.value,
          }),
          {}
        ),
      })
    ),
    map(account => AccountActions.successAddNewAccount({ account: account })),
    catchError(() => of(AccountActions.couldNotAddAccount()))
  );

const addNewAccountToCache = (
  actions$ = inject(Actions),
  cachedAccountProvider = inject(CachedAccountsProvider)
) =>
  actions$.pipe(
    ofType(AccountActions.successAddNewAccount),
    tap(({ account }) => {
      cachedAccountProvider.upsetAccount(account);
    }),
    map(() => ModalWindowActions.closeModalWindow())
  );

const switchAccountAfterAdding = (
  actions$ = inject(Actions),
  currentAccountProvider = inject(CurrentAccountProvider)
) =>
  actions$.pipe(
    ofType(AccountActions.successAddNewAccount),
    tap(({ account }) => {
      currentAccountProvider.setActiveAccountId(account);
    }),
    map(({ account }) =>
      SharedActions.setActiveAccountAfterAdding({ account: account })
    )
  );

export const accountEffects = {
  updateOneSettings: createEffect(updateOneSettings, StoreDispatchEffect),
  saveAccountSettings: createEffect(saveAccountSettings, StoreDispatchEffect),

  successSaveAccountSettings: createEffect(
    successSaveAccountSettings,
    StoreDispatchEffect
  ),

  updateAccountCacheAfterSaveAccount: createEffect(
    updateAccountCacheAfterSaveAccount,
    StoreUnDispatchEffect
  ),

  couldNotSaveAccountSettings: createEffect(
    couldNotSaveAccountSettings,
    StoreDispatchEffect
  ),

  apiException: createEffect(apiException, StoreDispatchEffect),
  onEmptyAccountError: createEffect(
    dispatchLogoutOnEmptyAccount,
    StoreDispatchEffect
  ),
  saveAccount: createEffect(saveAccount, StoreDispatchEffect),

  addNewAccount: createEffect(addNewAccount, StoreDispatchEffect),
  addNewAccountToCache: createEffect(addNewAccountToCache, StoreDispatchEffect),
  switchAccountAfterAdding: createEffect(
    switchAccountAfterAdding,
    StoreDispatchEffect
  ),
};
