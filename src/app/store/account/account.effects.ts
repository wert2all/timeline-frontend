import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AccountSettingInput, ApiClient } from '../../api/internal/graphql';
import { StoreDispatchEffect, StoreUnDispatchEffect } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { NotificationStore } from '../notifications/notifications.store';
import { AccountActions } from './account.actions';
import { accountFeature, mergeAccountSettings } from './account.reducer';

const cleanEffect = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(AuthActions.cleanAuthState),
    map(() => AccountActions.cleanAccount())
  );

const updateOneSettings = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(AccountActions.updateOneSetting),
    concatLatestFrom(() => store.select(accountFeature.selectActiveAccount)),
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

const successSaveAccountSettings = (
  actions$ = inject(Actions),
  notifier = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AccountActions.successSaveAccountSettings),
    map(() => {
      notifier.addMessage('Account settings saved', 'success');
    })
  );

const couldNotSaveAccountSettings = (
  actions$ = inject(Actions),
  notifier = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AccountActions.couldNotSaveAccountSettings),
    map(() => {
      notifier.addMessage('Could not save account settings', 'error');
    })
  );

const apiException = (
  actions$ = inject(Actions),
  notifier = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(AccountActions.apiException),
    map(({ exception }) => {
      notifier.addMessage(exception, 'error');
    })
  );

export const accountEffects = {
  cleanAccount: createEffect(cleanEffect, StoreUnDispatchEffect),
  updateOneSettings: createEffect(updateOneSettings, StoreDispatchEffect),
  saveAccountSettings: createEffect(saveAccountSettings, StoreDispatchEffect),

  successSaveAccountSettings: createEffect(
    successSaveAccountSettings,
    StoreUnDispatchEffect
  ),

  couldNotSaveAccountSettings: createEffect(
    couldNotSaveAccountSettings,
    StoreUnDispatchEffect
  ),

  apiException: createEffect(apiException, StoreUnDispatchEffect),
};
