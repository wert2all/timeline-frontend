import { createFeature, createReducer, on } from '@ngrx/store';
import { Pending, Status } from '../../app.types';
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
    }))
  ),
});
