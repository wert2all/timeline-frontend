import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { StoreDispatchEffect } from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { AccountActions } from '../account.actions';
import { accountFeature } from '../account.reducer';

export const avatarEffects = {
  dispatchUpdateAvatarAfterUpload: createEffect((actions = inject(Actions)) => {
    return actions.pipe(
      ofType(AccountActions.successUploadAvatar),
      map(({ imageId }) =>
        SharedActions.dispatchLoadingImages({ ids: [imageId] })
      )
    );
  }, StoreDispatchEffect),

  dispatchUpdateAccountAvatarsAfterInit: createEffect(
    (actions = inject(Actions), store = inject(Store)) => {
      return actions.pipe(
        ofType(
          AccountActions.setActiveAccountAfterInit,
          AccountActions.setActiveAccountAfterAuth
        ),
        concatLatestFrom(() => store.select(accountFeature.selectAccounts)),
        map(([_, accounts]) =>
          SharedActions.dispatchLoadingImages({
            ids: accounts
              .map(account => account.avatar.id)
              .filter(Boolean)
              .map(id => id!),
          })
        )
      );
    },
    StoreDispatchEffect
  ),
};
