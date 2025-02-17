import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { StoreDispatchEffect } from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { AccountActions } from '../account.actions';

export const avatarEffects = {
  dispatchUpdateAvatarAfterUpload: createEffect((actions = inject(Actions)) => {
    return actions.pipe(
      ofType(AccountActions.successUploadAvatar),
      map(({ imageId }) =>
        SharedActions.dispatchLoadingImages({ ids: [imageId] })
      )
    );
  }, StoreDispatchEffect),
};
