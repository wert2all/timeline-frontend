import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Status } from '../../../../app.types';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { PreviewActions } from './preview.actions';
import { PreviewState } from './preview.types';

const MAX_ATTEMPTS = 5;

const initialState: PreviewState = { previews: [] };

export const previewFeature = createFeature({
  name: 'preview',
  reducer: createReducer(
    initialState,

    on(PreviewActions.addURL, (state, { url }): PreviewState => {
      const previews = [...state.previews];

      if (
        previews.findIndex(preview => preview.url === url.toString()) === -1
      ) {
        previews.push({
          url: url.toString(),
          updateAttempts: 0,
          data: { status: Status.LOADING },
        });
      }

      return { ...state, previews: previews };
    }),

    on(
      PreviewActions.successAddingURL,
      (state, { preview, url }): PreviewState => ({
        ...state,
        previews: state.previews.map(holder =>
          holder.url === url ? { ...holder, data: preview } : holder
        ),
      })
    ),
    on(
      PreviewActions.successUpdatePreviews,
      (state, { previews }): PreviewState => ({
        ...state,
        previews: state.previews.map(existPreview => {
          const found = previews.find(
            preview => preview.url === existPreview.url
          );
          return found
            ? {
                url: existPreview.url,
                status: found.preview.status,
                updateAttempts: existPreview.updateAttempts + 1,
                data: found.preview,
              }
            : existPreview;
        }),
      })
    ),
    on(SharedActions.logout, (): PreviewState => initialState)
  ),
  extraSelectors: ({ selectPreviews }) => ({
    selectShouldUpdate: createSelector(selectPreviews, previews =>
      previews.filter(
        preview =>
          preview.data.status === Status.LOADING &&
          preview.updateAttempts <= MAX_ATTEMPTS
      )
    ),
  }),
});
