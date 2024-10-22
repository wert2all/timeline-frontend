import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Status } from '../../app.types';
import { PreviewActions } from './preview.actions';
import { PreviewState } from './preview.types';

const MAX_ATTEMPTS = 5;

const initState: PreviewState = { previews: [] };

export const previewFeature = createFeature({
  name: 'preview',
  reducer: createReducer(
    initState,

    on(PreviewActions.addURL, (state, { url }) => {
      const previews = [...state.previews];

      if (
        previews.findIndex(preview => preview.url === url.toString()) === -1
      ) {
        previews.push({
          url: url.toString(),
          updateAttemps: 0,
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
                updateAttemps: existPreview.updateAttemps + 1,
                data: found.preview,
              }
            : existPreview;
        }),
      })
    )
  ),
  extraSelectors: ({ selectPreviews }) => ({
    selectShouldUpdate: createSelector(selectPreviews, previews =>
      previews.filter(
        preview =>
          preview.data.status === Status.LOADING &&
          preview.updateAttemps <= MAX_ATTEMPTS
      )
    ),
  }),
});
