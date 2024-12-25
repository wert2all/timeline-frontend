import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import {
  catchError,
  concat,
  exhaustMap,
  interval,
  map,
  of,
  switchMap,
  takeUntil,
  toArray,
} from 'rxjs';
import { previewlyApiClient } from '../../api/external/previewly/graphql';
import { DataWrapper, Status, StoreDispatchEffect } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { accountFeature } from '../account/account.reducer';
import { AuthActions } from '../auth/auth.actions';
import { PreviewActions } from './preview.actions';
import { previewFeature } from './preview.reducers';
import { PreviewItem } from './preview.types';

const DELAY = 3000;

const addUrl = (
  action$ = inject(Actions),
  apiClient = inject(previewlyApiClient),
  store = inject(Store)
) =>
  action$.pipe(
    ofType(PreviewActions.addURL),
    concatLatestFrom(() =>
      store
        .select(accountFeature.selectActiveAccount)
        .pipe(map(account => account?.previewlyToken))
    ),
    exhaustMap(([{ url }, token]) => {
      return token
        ? apiClient.addUrl({ token: token, url: url.toString() }).pipe(
            map(result =>
              apiAssertNotNull(extractApiData(result)?.preview, 'Empty preview')
            ),
            map((preview): DataWrapper<PreviewItem> => {
              switch (preview.status) {
                case 'success':
                  return {
                    status: Status.SUCCESS,
                    data: {
                      image: preview.image,
                      title: preview.title || undefined,
                    },
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
          )
        : of(AuthActions.dispatchEmptyPreviewlyTokenError());
    })
  );

const startPolling = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(PreviewActions.successAddingURL),
    concatLatestFrom(() => store.select(previewFeature.selectShouldUpdate)),
    map(([, shouldUpdate]) =>
      shouldUpdate.map(preview => new URL(preview.url))
    ),
    map(urls =>
      urls.length > 0
        ? PreviewActions.startPollingPreviews({ urls })
        : PreviewActions.stopPollingPreviews()
    )
  );

const stopPolling = (actions$ = inject(Actions), store = inject(Store)) =>
  actions$.pipe(
    ofType(PreviewActions.successUpdatePreviews),
    concatLatestFrom(() => store.select(previewFeature.selectShouldUpdate)),
    map(([, shouldUpdate]) =>
      shouldUpdate.map(preview => new URL(preview.url))
    ),
    map(urls =>
      urls.length > 0
        ? PreviewActions.continuePollingPreviews()
        : PreviewActions.stopPollingPreviews()
    )
  );

const polling = (
  actions$ = inject(Actions),
  apiClient = inject(previewlyApiClient),
  store = inject(Store)
) =>
  actions$.pipe(
    ofType(PreviewActions.startPollingPreviews),
    concatLatestFrom(() =>
      store
        .select(accountFeature.selectActiveAccount)
        .pipe(map(account => account?.previewlyToken))
    ),
    switchMap(([{ urls }, token]) =>
      interval(DELAY).pipe(
        takeUntil(actions$.pipe(ofType(PreviewActions.stopPollingPreviews))),
        map(() => ({ urls, token: token }))
      )
    ),
    switchMap(({ urls, token }) =>
      token
        ? concat(
            ...urls.map(url =>
              apiClient
                .getPreview(
                  { token: token, url: url.toString() },
                  { fetchPolicy: 'no-cache' }
                )
                .pipe(
                  map(result =>
                    apiAssertNotNull(
                      extractApiData(result)?.preview,
                      'Empty preview'
                    )
                  ),
                  map((preview): DataWrapper<PreviewItem> => {
                    switch (preview.status) {
                      case 'success':
                        return {
                          status: Status.SUCCESS,
                          data: {
                            image: preview.image,
                            title: preview.title || undefined,
                          },
                        };
                      case 'error':
                        throw new Error(preview.error || 'Something was wrong');
                      default:
                        return { status: Status.LOADING };
                    }
                  }),
                  catchError(exception =>
                    of({ status: Status.ERROR, error: exception })
                  ),
                  map(preview => ({ url: url.toString(), preview: preview }))
                )
            )
          ).pipe(
            toArray(),
            map(previews => PreviewActions.successUpdatePreviews({ previews }))
          )
        : of(AuthActions.dispatchEmptyPreviewlyTokenError())
    )
  );

export const previewEffects = {
  addUrl: createEffect(addUrl, StoreDispatchEffect),

  startPolling: createEffect(startPolling, StoreDispatchEffect),
  polling: createEffect(polling, StoreDispatchEffect),
  stopPolling: createEffect(stopPolling, StoreDispatchEffect),
};
