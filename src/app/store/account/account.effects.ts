import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AccountSettingInput, ApiClient } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';

import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { NavigationActions } from '../../shared/store/navigation/navigation.actions';
import { SharedActions } from '../../shared/store/shared/shared.actions';
import {
  mergeAccountSettings,
  sharedFeature,
} from '../../shared/store/shared/shared.reducers';
import { Account } from '../../shared/store/shared/shared.types';
import { AuthActions } from '../auth/auth.actions';
import { AccountActions } from './account.actions';
import { ActiveAccountService } from './active-account.service';

const setUser = (
  actions$ = inject(Actions),
  activeAccountService = inject(ActiveAccountService)
) => {
  return actions$.pipe(
    ofType(AccountActions.setUser, AccountActions.setUserOnRedirect),
    map(({ user }) => {
      const savedAccountId = activeAccountService.activeAccount;
      return (
        user.accounts.find(account => account.id === savedAccountId) ||
        user.accounts.slice(0, 1)[0]
      );
    }),
    map(account =>
      account
        ? AccountActions.setAccount({ account })
        : AccountActions.dispatchEmptyAccountError()
    )
  );
};

const afterSetUserOnRedirect = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.setUserOnRedirect),
    map(() => AccountActions.afterSetUserOnRedirect())
  );

const cleanEffect = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AuthActions.dispatchLogout),
    map(() => AccountActions.cleanAccount())
  );

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
    map(() => AuthActions.dispatchLogout())
  );

const saveAccountToStorage = (
  actions$ = inject(Actions),
  accountService = inject(ActiveAccountService)
) =>
  actions$.pipe(
    ofType(AccountActions.setAccount),
    tap(({ account }) => {
      accountService.activeAccount = account;
    })
  );

const navigateToDashboard = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.afterSetUserOnRedirect),
    map(() => NavigationActions.toUserDashboard())
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

export const accountEffects = {
  setUser: createEffect(setUser, StoreDispatchEffect),

  saveAccountToLocalstorage: createEffect(
    saveAccountToStorage,
    StoreUnDispatchEffect
  ),
  cleanAccount: createEffect(cleanEffect, StoreUnDispatchEffect),
  updateOneSettings: createEffect(updateOneSettings, StoreDispatchEffect),
  saveAccountSettings: createEffect(saveAccountSettings, StoreDispatchEffect),

  successSaveAccountSettings: createEffect(
    successSaveAccountSettings,
    StoreDispatchEffect
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
  afterSetUserOnRedirect: createEffect(
    afterSetUserOnRedirect,
    StoreDispatchEffect
  ),
  navigateToDashboardAfterRedirect: createEffect(
    navigateToDashboard,
    StoreDispatchEffect
  ),
  saveAccount: createEffect(saveAccount, StoreDispatchEffect),
};
