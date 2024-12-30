import { inject, Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  catchError,
  concat,
  map,
  Observable,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { previewlyApiClient } from '../../api/external/previewly/graphql';

import { Status as ApiStatus } from '../../api/external/previewly/graphql';
import { Pending, Status, StatusWithPending } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { PollingOptions } from '../../libs/polling/polling.types';
import { accountFeature } from '../account/account.reducer';
import { AuthActions } from '../auth/auth.actions';
import { ImagesActions, ImagesPollingActionProps } from './images.actions';
import { imagesFeature } from './images.reducer';
import { UploadedImage } from './images.types';

@Injectable({ providedIn: 'root' })
export class ImagesPollingOptions
  implements PollingOptions<ImagesPollingActionProps, number>
{
  private store = inject(Store);
  private api = inject(previewlyApiClient);

  startPollingAction = ImagesActions.startPolling;
  stopPollingAction = ImagesActions.stopPolling;
  continuePollingAction = ImagesActions.continuePolling;

  selectPollingItems(actions: Actions): Observable<number[]> {
    return actions.pipe(
      ofType(ImagesActions.dispatchPolling),
      concatLatestFrom(() =>
        this.store.select(imagesFeature.selectShouldUpdate)
      ),
      map(([, images]) => images.map(image => image.id))
    );
  }

  convertToActionProps(items: number[]): ImagesPollingActionProps {
    return { images: items };
  }

  continuePollingEffect(
    flow$: Observable<ImagesPollingActionProps & Action<string>>
  ): Observable<Action<string>> {
    return flow$.pipe(
      concatLatestFrom(() =>
        this.store
          .select(accountFeature.selectActiveAccount)
          .pipe(map(account => account?.previewlyToken))
      ),
      switchMap(([{ images }, token]) => {
        return token
          ? concat(
              ...images.map(imageId =>
                this.api.getResizedImage({ imageId, token }).pipe(
                  map(result =>
                    apiAssertNotNull(
                      extractApiData(result)?.resizedImage,
                      'Empty resized image'
                    )
                  ),
                  map((image): UploadedImage => {
                    if (image.image?.url) {
                      return {
                        id: imageId,
                        data: {
                          resized_490x250: image.image.url,
                        },
                        status: this.getImageStatus(image.status),
                        error: image.error,
                      };
                    }

                    throw new Error('Empty image URL');
                  }),
                  catchError(error =>
                    of({
                      id: imageId,
                      status: Status.ERROR,
                      error: error.message,
                      data: null,
                    })
                  )
                )
              )
            ).pipe(
              toArray(),
              map(images =>
                ImagesActions.successUpdateImages({ images: images })
              )
            )
          : of(AuthActions.dispatchEmptyPreviewlyTokenError());
      })
    );
  }

  private getImageStatus(status: ApiStatus): StatusWithPending {
    switch (status) {
      case 'success':
        return Status.SUCCESS;
      case 'error':
        return Status.ERROR;
      default:
        return Pending.PENDING;
    }
  }
}
