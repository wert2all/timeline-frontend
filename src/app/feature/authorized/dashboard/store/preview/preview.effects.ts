import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { previewlyApiClient } from '../../../../../api/external/previewly/graphql';
import {
  DataWrapper,
  Status,
  StoreDispatchEffect,
} from '../../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../../libs/api.functions';
import { createPolling } from '../../../../../libs/polling/polling.factory';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../../shared/store/shared/shared.reducers';
import { PreviewActions } from './preview.actions';
import { PreviewPollingOptions } from './preview.polling.options';
import { PreviewItem } from './preview.types';

const addUrl = (
  action$ = inject(Actions),
  apiClient = inject(previewlyApiClient),
  store = inject(Store)
) =>
  action$.pipe(
    ofType(PreviewActions.addURL),
    concatLatestFrom(() =>
      store
        .select(sharedFeature.selectActiveAccount)
        .pipe(map(account => account?.previewlyToken))
    ),
    exhaustMap(([{ url }, token]) =>
      token
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
        : of(SharedActions.dispatchEmptyPreviewlyTokenError())
    )
  );
export const previewEffects = {
  addUrl: createEffect(addUrl, StoreDispatchEffect),

  startPolling: createEffect((options = inject(PreviewPollingOptions)) => {
    return createPolling(options).startPolling();
  }, StoreDispatchEffect),
  continuePolling: createEffect((options = inject(PreviewPollingOptions)) => {
    return createPolling(options).continuePolling();
  }, StoreDispatchEffect),
  stopColling: createEffect((options = inject(PreviewPollingOptions)) => {
    return createPolling(options).stopPolling();
  }, StoreDispatchEffect),
};
