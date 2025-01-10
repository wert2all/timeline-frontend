import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Pending, Status } from '../../app.types';
import { updateStateRecord } from '../../libs/state.functions';
import { EventActions } from '../timeline/timeline.actions';
import { ImagesActions, UploadActions } from './images.actions';
import { ImagesState } from './images.types';

const initState: ImagesState = {
  currentUpload: { loading: false, previewUrl: null, error: null },
  images: {},
};

export const imagesFeature = createFeature({
  name: 'images',
  reducer: createReducer(
    initState,

    on(
      UploadActions.uploadImage,
      (state, { image }): ImagesState => ({
        ...state,
        currentUpload: {
          loading: true,
          previewUrl: URL.createObjectURL(image),
          error: null,
        },
      })
    ),
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
          currentUpload: { previewUrl: null, loading: false, error: null },
        };
      }
    ),
    on(UploadActions.failedUploadImage, (state, { error }) => ({
      ...state,
      currentUpload: {
        previewUrl: null,
        loading: false,
        error: error,
      },
    })),

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
    }))
  ),
  extraSelectors: ({ selectImages }) => ({
    selectShouldUpdate: createSelector(selectImages, images =>
      Object.values(images).filter(image => image.status == Pending.PENDING)
    ),
    selectLoadedImages: createSelector(selectImages, images =>
      Object.values(images).filter(image => image.status !== Pending.PENDING)
    ),
  }),
});
