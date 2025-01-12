import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Pending, Status, UniqueType } from '../../app.types';
import { updateStateRecord } from '../../libs/state.functions';
import { EventActions } from '../timeline/timeline.actions';
import { ImagesActions, UploadActions } from './images.actions';
import { ImagesState, UploadQuequeImage } from './images.types';

const updateQueque = (
  queue: Record<UniqueType, UploadQuequeImage>,
  image: UploadQuequeImage
): Record<UniqueType, UploadQuequeImage> =>
  [...Object.values(queue), image].reduce(
    (acc: Record<UniqueType, UploadQuequeImage>, event) => {
      acc[event.uuid] = image.uuid === event.uuid ? image : event;
      return acc;
    },
    {}
  );

const initState: ImagesState = {
  images: {},
  maybeShouldRemoveImages: [],
  queue: {},
};

export const imagesFeature = createFeature({
  name: 'images',
  reducer: createReducer(
    initState,

    on(
      UploadActions.successUploadImage,
      (state, { id, status, error }): ImagesState => {
        const images = { ...Object.values(state.images) };

        images[id] = {
          id,
          status: status == Status.SUCCESS ? Pending.PENDING : status,
          error,
          data: null,
        };

        return {
          ...state,
          images: images,
        };
      }
    ),
    on(UploadActions.failedUploadImage, (state, { error }) => ({
      ...state,
      currentUpload: {
        previewUrl: null,
        loading: false,
        error: error,
        title: '',
      },
    })),

    on(UploadActions.uploadImage, (state, { uuid }) => ({
      ...state,
      queue: updateQueque(state.queue, { uuid, status: Pending.PENDING }),
    })),

    on(
      UploadActions.successUploadImage,
      (state, { id, uuid, error, status }) => ({
        ...state,
        queue: updateQueque(state.queue, {
          uuid,
          error: error ? new Error(error) : undefined,
          status,
          id,
        }),
      })
    ),
    on(UploadActions.failedUploadImage, (state, { error, uuid }) => ({
      ...state,
      queue: updateQueque(state.queue, {
        error: new Error(error),
        uuid,
        status: Status.ERROR,
      }),
    })),

    on(EventActions.closeEditForm, state => ({ ...state, queue: {} })),
    on(EventActions.successLoadTimelineEvents, (state, { events }) => ({
      ...state,
      images: updateStateRecord(
        state.images,
        events
          .map(event =>
            event.imageId &&
            (!state.images[event.imageId] || !state.images[event.imageId].data)
              ? {
                  id: event.imageId,
                  status: Pending.PENDING,
                  error: null,
                  data: null,
                }
              : null
          )
          .filter(image => !!image)
      ),
    })),

    on(ImagesActions.successUpdateImages, (state, { images }) => ({
      ...state,
      images: updateStateRecord(state.images, images),
    })),

    on(ImagesActions.maybeShouldRemoveImages, (state, { images }) => ({
      ...state,
      maybeShouldRemoveImages: images,
    })),

    on(EventActions.closeEditForm, state => ({
      ...state,
      maybeShouldRemoveImages: [],
    })),

    on(EventActions.deleteEvent, (state, { imageId }) => ({
      ...state,
      maybeShouldRemoveImages: imageId ? [imageId] : [],
    })),
    on(
      EventActions.failedDeleteEvent,
      EventActions.successDeleteEvent,
      state => ({
        ...state,
        maybeShouldRemoveImages: [],
      })
    )
  ),
  extraSelectors: ({ selectImages, selectQueue }) => ({
    selectCurrentUploadImage: createSelector(selectQueue, queque =>
      Object.values(queque).pop()
    ),
    selectShouldUpdate: createSelector(selectImages, images =>
      Object.values(images).filter(image => image.status == Pending.PENDING)
    ),
    selectLoadedImages: createSelector(selectImages, images =>
      Object.values(images).filter(image => image.status !== Pending.PENDING)
    ),
  }),
});
