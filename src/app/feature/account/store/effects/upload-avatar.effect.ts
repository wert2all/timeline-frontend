import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { StoreDispatchEffect } from '../../../../app.types';
import { UploadService } from '../../../../shared/services/upload.service';
import { AccountActions } from '../account.actions';

export const uploadAvatarEffects = {
  uploadAvatar: createEffect(
    (actions = inject(Actions), uploadService = inject(UploadService)) => {
      return actions.pipe(
        ofType(AccountActions.uploadAvatar),
        exhaustMap(({ avatar, account }) =>
          uploadService.uploadImage(
            [avatar.file],
            account.id,
            account.previewlyToken
          )
        ),
        map(images => images[0]),
        map(image => {
          if (image.error) {
            throw image.error;
          } else {
            return image.data;
          }
        }),
        map(image =>
          image?.id
            ? AccountActions.successUploadAvatar({ imageId: image.id })
            : AccountActions.failedUploadAvatar()
        ),
        catchError(() => of(AccountActions.failedUploadAvatar()))
      );
    },
    StoreDispatchEffect
  ),
};
