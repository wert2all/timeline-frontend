import { createFeature, createReducer, on } from '@ngrx/store';
import { Status } from '../../app.types';
import { PreviewActions } from './preview.actions';
import { PreviewState } from './preview.types';

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
    )
  ),
});
