import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, exhaustMap, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { previewlyApiClient } from '../../api/external/previewly/graphql';
import { Status, StoreDispatchEffect } from '../../app.types';
import { PreviewActions } from './preview.actions';

const TOKEN = environment.services.previewly.token;
const addUrl = (
  action$ = inject(Actions),
  apiClient = inject(previewlyApiClient)
) => {
  return action$.pipe(
    ofType(PreviewActions.addURL),
    exhaustMap(({ url }) => {
      return apiClient.addUrl({ token: TOKEN, url: url.toString() }).pipe(
        map(result => {
          if (result.errors) {
            throw new Error(result.errors[result.errors.length - 1].message);
          }
          return result.data?.preview;
        }),
        map(preview => {
          if (preview) {
            return preview;
          } else {
            throw new Error('Empty preview');
          }
        }),
        map(preview => {
          switch (preview.status) {
            case 'success':
              return {
                status: Status.SUCCESS,
                data: { image: preview.image, title: preview.title },
              };
            case 'error':
              throw new Error(preview.error || 'Something was wrong');
            default:
              return { status: Status.LOADING };
          }
        }),
        catchError(exception => {
          return of({ status: Status.ERROR, error: exception });
        }),
        map(preview => {
          return PreviewActions.successAddingURL({
            url: url.toString(),
            preview: preview,
          });
        })
      );
    })
  );
};
export const previewEffects = {
  addUrl: createEffect(addUrl, StoreDispatchEffect),
};
