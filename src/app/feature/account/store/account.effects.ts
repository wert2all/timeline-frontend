import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AccountSettingInput, ApiClient } from '../../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../../app.types';

import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { NavigationBuilder } from '../../../shared/services/navigation/navigation.builder';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { ModalWindowActions } from '../../ui/layout/store/modal-window/modal-window.actions';
import { NotificationStore } from '../../ui/layout/store/notification/notifications.store';
import { toAccount } from '../account.functions';
import { AccountActions } from './account.actions';
import { avatarEffects } from './effects/images.effects';
import { initStateEffects } from './effects/init.effect';
import { setActiveAccount } from './effects/switch-account.effects';
import { uploadAvatarEffects } from './effects/upload-avatar.effect';

const updateOneSettings = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.updateOneSetting),
    map(({ accountId, settings, key, value }) => {
      const updatedsettings = { ...settings };
      updatedsettings[key] = value;
      return { accountId, settings: updatedsettings };
    }),
    map(({ accountId, settings }) =>
      AccountActions.saveAccountSettings({
        accountId,
        settings,
      })
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
            about: settings.about,
            avatarID: settings.avatarId,
          },
        })
        .pipe(
          map(result =>
            apiAssertNotNull(extractApiData(result)?.account, 'Empty account')
          ),
          map(acc => toAccount(acc))
        )
    ),
    map(account => AccountActions.successSaveAccount({ account: account })),
    catchError(err => of(AccountActions.apiException({ exception: err })))
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
    map(account => toAccount(account)),
    map(account => AccountActions.successAddNewAccount({ account: account })),
    catchError(() => of(AccountActions.couldNotAddAccount()))
  );

const closeWindowAfterAddAccount = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AccountActions.successAddNewAccount),
    map(() => ModalWindowActions.closeModalWindow())
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

const redirectAfterAuth = (
  actions$ = inject(Actions),
  navigationBuilder = inject(NavigationBuilder)
) =>
  actions$.pipe(
    ofType(AccountActions.setActiveAccountAfterAuth),
    map(({ redirect }) => {
      if (!redirect) {
        return null;
      }
      return redirect.startsWith('/') ? redirect : null;
    }),
    map(url =>
      url
        ? SharedActions.navigateToURL({ url })
        : SharedActions.navigate({
          destination: navigationBuilder.forDashboard().index(),
        })
    )
  );

export const accountEffects = {
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
  saveAccount: createEffect(saveAccount, StoreDispatchEffect),

  addNewAccount: createEffect(addNewAccount, StoreDispatchEffect),
  addNewAccountToCache: createEffect(
    closeWindowAfterAddAccount,
    StoreDispatchEffect
  ),

  redirectAfterAuth: createEffect(redirectAfterAuth, StoreDispatchEffect),
  notifyEmptyAccount: createEffect(notifyEmptyAccount, StoreUnDispatchEffect),

  ...initStateEffects,
  ...avatarEffects,
  ...setActiveAccount,
  ...uploadAvatarEffects,
};
