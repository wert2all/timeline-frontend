import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { Status, StoreDispatchEffect } from '../../app.types';
import { PreviewActions } from './preview.actions';

const addUrl = (action$ = inject(Actions)) => {
  return action$.pipe(
    ofType(PreviewActions.addURL),
    map(({ url }) =>
      PreviewActions.successAddingURL({
        url: url.toString(),
        preview: {
          status: Status.LOADING,
        },
      })
    )
  );
};
export const previewEffects = {
  addUrl: createEffect(addUrl, StoreDispatchEffect),
};
