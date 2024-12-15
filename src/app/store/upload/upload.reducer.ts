import { createFeature, createReducer, on } from '@ngrx/store';
import { UploadActions } from './upload.actions';
import { UploadState } from './upload.types';

const initState: UploadState = {
  currentUpload: { loading: false, previewUrl: null, error: null },
  images: [],
};

export const uploadFeature = createFeature({
  name: 'upload',
  reducer: createReducer(
    initState,

    on(
      UploadActions.uploadImage,
      (state, { image }): UploadState => ({
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
      (state, { id, status, error }): UploadState => ({
        ...state,
        images: [
          ...state.images,
          {
            id,
            status,
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
