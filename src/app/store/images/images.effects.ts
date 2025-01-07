import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, tap } from 'rxjs';
import { previewlyApiClient } from '../../api/external/previewly/graphql';
import {
  Status,
  StoreDispatchEffect,
  StoreUnDispatchEffect,
} from '../../app.types';
import {
  ImagesTaskExecutorFactory,
  TaskResultImages,
} from '../../feature/task/executors/images.factory';
import { accountFeature } from '../account/account.reducer';
import { AuthActions } from '../auth/auth.actions';
import { NotificationStore } from '../notifications/notifications.store';
import { TaskActions } from '../task/task.actions';
import { TaskType } from '../task/task.types';
import { EventActions } from '../timeline/timeline.actions';
import { ImagesActions, UploadActions } from './images.actions';
import { imagesFeature } from './images.reducer';

const convertStatus = (status: string): Status => {
  switch (status) {
    case 'pending':
      return Status.LOADING;
    case 'success':
      return Status.SUCCESS;
    default:
      return Status.ERROR;
  }
};

const uploadImage = (
  actions$ = inject(Actions),
  store = inject(Store),
  apiClient = inject(previewlyApiClient)
) =>
  actions$.pipe(
    ofType(UploadActions.uploadImage),
    concatLatestFrom(() =>
      store
        .select(accountFeature.selectActiveAccount)
        .pipe(map(account => account?.previewlyToken))
    ),
    exhaustMap(([{ image }, token]) =>
      token
        ? apiClient.uploadImages({ images: [image], token }).pipe(
            map(result => result.data?.upload),
            map(data =>
              data && data[0]
                ? UploadActions.successUploadImage({
                    id: data[0].id,
                    status: convertStatus(data[0].status),
                    error: data[0].error,
                  })
                : UploadActions.failedUploadImage({
                    error: 'Failed to load uploaded image',
                  })
            ),
            catchError(error => of(UploadActions.failedUploadImage({ error })))
          )
        : of(AuthActions.dispatchEmptyPreviewlyTokenError())
    )
  );

const notifyFailedUploadImage = (
  actions$ = inject(Actions),
  notification = inject(NotificationStore)
) =>
  actions$.pipe(
    ofType(UploadActions.failedUploadImage),
    tap(error => {
      notification.addMessage('Could not upload image: ' + error, 'error');
    })
  );

const createTaskForLoadImages = (
  actions$ = inject(Actions),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(
      EventActions.successUpdateEvent,
      UploadActions.successUploadImage,
      EventActions.successLoadActiveTimelineEvents
    ),
    concatLatestFrom(() => store.select(imagesFeature.selectShouldUpdate)),
    map(([, images]) => images.map(image => image.id)),
    concatLatestFrom(() =>
      store
        .select(accountFeature.selectActiveAccount)
        .pipe(map(account => account?.previewlyToken))
    ),
    map(([imageIds, token]) => {
      if (token) {
        return imageIds.length === 0
          ? ImagesActions.shouldNotLoadEmptyImageList()
          : TaskActions.createTask({
              task: ImagesTaskExecutorFactory.createTaskProps(imageIds, token),
            });
      }
      throw new Error('No token');
    })
  );

const successLoadingImagesTask = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(TaskActions.successTask),
    filter(({ taskType }) => taskType === TaskType.LOAD_IMAGES),
    map(({ data }) => data as TaskResultImages),
    map(result => result.images),
    map(images => ImagesActions.successUpdateImages({ images: images || [] }))
  );

export const imageEffects = {
  uploadEventInmage: createEffect(uploadImage, StoreDispatchEffect),
  failedUploadImage: createEffect(
    notifyFailedUploadImage,
    StoreUnDispatchEffect
  ),

  createTaskForLoadImages: createEffect(
    createTaskForLoadImages,
    StoreDispatchEffect
  ),
  successTaskOfLoadingImages: createEffect(
    successLoadingImagesTask,
    StoreDispatchEffect
  ),
};
