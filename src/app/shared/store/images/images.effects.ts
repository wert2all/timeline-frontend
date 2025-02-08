import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, tap } from 'rxjs';
import { previewlyApiClient } from '../../../api/external/previewly/graphql';
import { Status, StoreDispatchEffect } from '../../../app.types';
import {
  ImagesTaskExecutorFactory,
  TaskResultImages,
} from '../../../feature/task/executors/images.factory';

import { EventOperationsActions } from '../../../feature/events/store/operations/operations.actions';
import { eventOperationsFeature } from '../../../feature/events/store/operations/operations.reducer';
import { TaskActions } from '../../../store/task/task.actions';
import { TaskType } from '../../../store/task/task.types';
import { SharedActions } from '../shared/shared.actions';
import { sharedFeature } from '../shared/shared.reducers';
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
    concatLatestFrom(() => store.select(sharedFeature.selectActiveAccount)),
    map(([{ image, uuid }, account]) => ({
      image: { image: image, extra: account?.id.toString() },
      uuid,
      token: account?.previewlyToken,
    })),
    exhaustMap(({ image, uuid, token }) =>
      token
        ? apiClient.uploadImages({ images: [image], token }).pipe(
            map(result => result.data?.upload),
            map(data =>
              data && data[0]
                ? UploadActions.successUploadImage({
                    uuid,
                    id: data[0].id,
                    status: convertStatus(data[0].status),
                    error: data[0].error,
                  })
                : UploadActions.failedUploadImage({
                    uuid,
                    error: 'Failed to load uploaded image',
                  })
            ),
            catchError(error =>
              of(UploadActions.failedUploadImage({ uuid, error }))
            )
          )
        : of(SharedActions.dispatchEmptyPreviewlyTokenError())
    )
  );

const notifyFailedUploadImage = (actions$ = inject(Actions)) =>
  actions$.pipe(
    ofType(UploadActions.failedUploadImage),
    map(error =>
      SharedActions.sendNotification({
        message: 'Could not upload image: ' + error,
        withType: 'error',
      })
    )
  );

const createTaskForLoadImages = (
  actions$ = inject(Actions),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(
      EventOperationsActions.successUpdateEvent,
      UploadActions.successUploadImage
    ),
    concatLatestFrom(() => store.select(imagesFeature.selectShouldUpdate)),
    map(([, images]) => images.map(image => image.id)),
    concatLatestFrom(() =>
      store
        .select(sharedFeature.selectActiveAccount)
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

const addImageOnEdit = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(EventOperationsActions.dispatchEditEvent),
    concatLatestFrom(() =>
      store.select(eventOperationsFeature.selectActiveTimelineEvents)
    ),
    map(
      ([{ eventId }, events]) =>
        events.find(event => event.id === eventId)?.imageId
    ),
    map(imageId => ImagesActions.maybeShouldDeleteImage({ imageId }))
  );
const deleteImagesAfterSave = (
  actions$ = inject(Actions),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(
      EventOperationsActions.successUpdateEvent,
      EventOperationsActions.successPushNewEvent
    ),
    concatLatestFrom(() => store.select(imagesFeature.selectShouldDelete)),
    map(([{ event }, shouldDelete]) =>
      shouldDelete
        .filter(imageId => event.imageId != imageId.id)
        .map(imageId => imageId.id)
    ),
    tap(images => console.log('deleted images: ', images)),
    map(images => ImagesActions.successDeletingImages({ images }))
  );

const deleteImagesAfterDelete = (
  actions$ = inject(Actions),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(EventOperationsActions.successDeleteEvent),
    concatLatestFrom(() => store.select(imagesFeature.selectShouldDelete)),
    map(([, imageIds]) => imageIds.map(imageId => imageId.id)),
    tap(images => console.log('deleted images: ', images)),
    map(images => ImagesActions.successDeletingImages({ images }))
  );

export const imageEffects = {
  uploadEventInmage: createEffect(uploadImage, StoreDispatchEffect),
  failedUploadImage: createEffect(notifyFailedUploadImage, StoreDispatchEffect),

  createTaskForLoadImages: createEffect(
    createTaskForLoadImages,
    StoreDispatchEffect
  ),
  successTaskOfLoadingImages: createEffect(
    successLoadingImagesTask,
    StoreDispatchEffect
  ),

  addImageOnEdit: createEffect(addImageOnEdit, StoreDispatchEffect),
  deleteImagesAfterSave: createEffect(
    deleteImagesAfterSave,
    StoreDispatchEffect
  ),

  deleteImagesAfterDelete: createEffect(
    deleteImagesAfterDelete,
    StoreDispatchEffect
  ),
};
