import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Iterable, Pending, Status, UniqueType } from '../../app.types';
import { EventActions } from '../events/events.actions';
import { ImagesActions, UploadActions } from './images.actions';
import { ImagesState, UploadQuequeImage } from './images.types';

const initState: ImagesState = { images: {}, queue: {}, shouldDelete: [] };

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

    on(
      UploadActions.uploadImage,
      (state, { uuid }): ImagesState => ({
        ...state,
        queue: updateQueque(state.queue, { uuid, status: Pending.PENDING }),
      })
    ),

    on(
      UploadActions.successUploadImage,
      (state, { id, uuid, error, status }): ImagesState => ({
        ...state,
        queue: updateQueque(state.queue, {
          uuid,
          error: error ? new Error(error) : undefined,
          status,
          id,
        }),
      })
    ),
    on(
      UploadActions.failedUploadImage,
      (state, { error, uuid }): ImagesState => ({
        ...state,
        queue: updateQueque(state.queue, {
          error: new Error(error),
          uuid,
          status: Status.ERROR,
        }),
      })
    ),

    on(
      EventActions.stopEditingEvent,
      (state): ImagesState => ({ ...state, queue: {} })
    ),
    on(
      EventActions.successLoadTimelineEvents,
      (state, { events }): ImagesState => ({
        ...state,
        images: updateImagesState(
          state.images,
          events
            .map(event =>
              event.imageId &&
              (!state.images[event.imageId] ||
                !state.images[event.imageId].data)
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
      })
    ),

    on(
      ImagesActions.successUpdateImages,
      (state, { images }): ImagesState => ({
        ...state,
        images: updateImagesState(state.images, images),
      })
    ),

    on(
      ImagesActions.maybeShouldDeleteImage,
      (state, { imageId }): ImagesState =>
        imageId
          ? {
              ...state,
              shouldDelete: [...state.shouldDelete, { id: imageId }],
            }
          : state
    ),

    on(
      EventActions.deleteEvent,
      (state, { imageId }): ImagesState => ({
        ...state,
        shouldDelete: imageId ? [{ id: imageId }] : [],
      })
    ),

    on(
      EventActions.failedDeleteEvent,
      (state): ImagesState => ({
        ...state,
        shouldDelete: [],
      })
    ),

    on(
      ImagesActions.successDeletingImages,
      (state): ImagesState => ({
        ...state,
        shouldDelete: [],
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

const updateImagesState = <T extends Iterable>(
  existStateRecord: Record<number, T>,
  items: T[]
): Record<number, T> => {
  if (items.length > 0) {
    return [...Object.values(existStateRecord), ...items].reduce(
      (acc: Record<number, T>, event) => {
        acc[event.id] = items.find(e => e.id === event.id) || event;
        return acc;
      },
      {}
    );
  }

  return existStateRecord;
};
