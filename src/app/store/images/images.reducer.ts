import { createFeature, createReducer, on } from '@ngrx/store';
import { Pending, Status } from '../../app.types';
import { EventActions } from '../timeline/timeline.actions';
import { UploadActions } from './images.actions';
import { ImagesState } from './images.types';

const initState: ImagesState = {
  currentUpload: { loading: false, previewUrl: null, error: null },
  images: [],
};

export const uploadFeature = createFeature({
  name: 'upload',
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
      (state, { id, status, error }): ImagesState => ({
        ...state,
        images: [
          ...state.images,
          {
            id,
            status: status == Status.SUCCESS ? Pending.PENDING : status,
            error,
            data: null,
          },
        ],
        currentUpload: { previewUrl: null, loading: false, error: null },
      })
    ),
    on(UploadActions.failedUploadImage, (state, { error }) => ({
      ...state,
      currentUpload: {
        previewUrl: null,
        loading: false,
        error: error,
      },
    })),

    on(EventActions.successLoadActiveTimelineEvents, (state, { events }) => {
      const maybeNewImages = events
        .map(event =>
          event.imageId
            ? {
                id: event.imageId,
                status: Status.SUCCESS,
                data: null,
                error: null,
              }
            : undefined
        )
        .filter(image => !!image);

      if (maybeNewImages.length > 0) {
        return {
          ...state,
          images: [...state.images, ...maybeNewImages],
        };
      }
      return state;
    })
  ),
});
