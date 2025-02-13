import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AccountSettingInput, ApiClient } from '../../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';

import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { NavigationActions } from '../../../shared/store/navigation/navigation.actions';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { ModalWindowActions } from '../../ui/layout/store/modal-window/modal-window.actions';
import { NotificationStore } from '../../ui/layout/store/notification/notifications.store';
import { Account } from '../account.types';
import { CurrentAccountProvider } from '../current.provider';
import { CachedAccountsProvider } from '../share/cached-accounts.provider';
import { AccountActions } from './account.actions';

const updateOneSettings = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.updateOneSetting),
    map(({ accountId, settings, key, value }) => {
      settings[key] = value;
      return AccountActions.saveAccountSettings({
        accountId,
        settings,
      });
    })
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
        actionSetting: action.settings,
      };
    }),
    exhaustMap(({ accountId, settings, actionSetting }) =>
      api
        .saveAccountSettings({
          accountId: accountId,
          settings: settings,
        })
        .pipe(
          map(result =>
            result.data?.saveSettings == 'success'
              ? AccountActions.successSaveAccountSettings({
                  accountId,
                  settings: actionSetting,
                })
              : AccountActions.couldNotSaveAccountSettings()
          )
        )
    ),
    catchError(err => of(AccountActions.apiException({ exception: err })))
  );

const successSaveAccountSettings = (
  actions$ = inject(Actions),
  cachedAccountProvider = inject(CachedAccountsProvider)
) =>
  actions$.pipe(
    ofType(AccountActions.successSaveAccountSettings),
    tap(({ accountId, settings }) => {
      cachedAccountProvider.updateAccountSettings(accountId, settings);
    }),
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
            about: settings.about,
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

const saveActiveAccountIdToCache = (
  actions$ = inject(Actions),
  currentAccountProvider = inject(CurrentAccountProvider)
) =>
  actions$.pipe(
    ofType(
      AccountActions.successAddNewAccount,
      AccountActions.setActiveAccountAfterInit,
      AccountActions.setActiveAccountAfterAuth,
      SharedActions.switchActiveAccount
    ),
    tap(({ account }) => {
      currentAccountProvider.setActiveAccountId(account);
    })
  );

const updateAccounstsCacheAfterAuthorization = (
  actions$ = inject(Actions),
  cachedAccounts = inject(CachedAccountsProvider)
) =>
  actions$.pipe(
    ofType(SharedActions.successAuthenticated),
    tap(({ accounts }) => {
      cachedAccounts.setAccounts(accounts);
    })
  );

const notifyEmptyAccount = (
  actions$ = inject(Actions),
  notificationStore = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AccountActions.emptyCurrentAccount),
    tap(() => {
      notificationStore.addMessage('Cannot set empty account', 'error');
    })
  );

const redirectAfterAuth = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.setActiveAccountAfterAuth),
    map(() => NavigationActions.toUserDashboard())
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
    saveActiveAccountIdToCache,
    StoreUnDispatchEffect
  ),

  updateAccounstsCacheAfterAuthorization: createEffect(
    updateAccounstsCacheAfterAuthorization,
    StoreUnDispatchEffect
  ),

  redirectAfterAuth: createEffect(redirectAfterAuth, StoreDispatchEffect),
  notifyEmptyAccount: createEffect(notifyEmptyAccount, StoreUnDispatchEffect),
};
