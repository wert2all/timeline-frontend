import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  concat,
  map,
  Observable,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import {
  Status as ApiStatus,
  previewlyApiClient,
} from '../../../api/external/previewly/graphql';
import { Pending, Status, StatusWithPending } from '../../../app.types';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { accountFeature } from '../../../store/account/account.reducer';
import { UploadedImage } from '../../../store/images/images.types';
import { ExecutorResult, TaskExecutor, TaskOption } from '../task.types';

export type TaskResultImages = { images: UploadedImage[] };

export const imageTaskExecutor =
  (
    api = inject(previewlyApiClient),
    store = inject(Store)
  ): TaskExecutor<TaskResultImages> =>
  (options: TaskOption[]): Observable<ExecutorResult<TaskResultImages>> => {
    const imageIds: number[] = extractIdFromOptions(options);
    if (imageIds) {
      return store.select(accountFeature.selectActiveAccount).pipe(
        map(account => account?.previewlyToken),
        switchMap(token => {
          if (token) {
            return concat(
              ...imageIds.map(imageId =>
                api.getResizedImage({ imageId, token }).pipe(
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
                        status: getImageStatus(image.status),
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
              map(
                (images): ExecutorResult<TaskResultImages> => ({
                  status: 'done',
                  data: { images: images },
                })
              )
            );
          }
          throw 'Empty token';
        })
      );
    } else {
      throw 'Empty image ID';
    }
  };

const extractIdFromOptions = (options: TaskOption[]): number[] =>
  options
    .find(option => option.name === 'ids')
    ?.value.split(',')
    .map(i => Number(i))
    .filter(i => isFinite(i)) || [];

const getImageStatus = (status: ApiStatus): StatusWithPending => {
  switch (status) {
    case 'success':
      return Status.SUCCESS;
    case 'error':
      return Status.ERROR;
    default:
      return Pending.PENDING;
  }
};
