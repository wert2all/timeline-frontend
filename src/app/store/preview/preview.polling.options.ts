import { inject, Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  catchError,
  concat,
  map,
  Observable,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { previewlyApiClient } from '../../api/external/previewly/graphql';
import { DataWrapper, Status } from '../../app.types';
import { apiAssertNotNull, extractApiData } from '../../libs/api.functions';
import { PollingOptions } from '../../libs/polling/polling.types';
import { accountFeature } from '../account/account.reducer';
import { AuthActions } from '../auth/auth.actions';
import { PreviewActions } from './preview.actions';
import { previewFeature } from './preview.reducers';
import { PreviewItem, PreviewPollingActionsProps } from './preview.types';

@Injectable({ providedIn: 'root' })
export class PreviewPollingOptions
  implements PollingOptions<PreviewPollingActionsProps, URL>
{
  private store = inject(Store);
  private api = inject(previewlyApiClient);

  startPollingAction = PreviewActions.startPollingPreviews;
  stopPollingAction = PreviewActions.stopPollingPreviews;
  continuePollingAction = PreviewActions.continuePollingPreviews;

  convertToActionProps(items: URL[]) {
    return { urls: items };
  }

  selectPollingItems(actions: Actions) {
    return actions.pipe(
      ofType(PreviewActions.successAddingURL),
      concatLatestFrom(() =>
        this.store.select(previewFeature.selectShouldUpdate)
      ),
      map(([, shouldUpdate]) =>
        shouldUpdate.map(preview => new URL(preview.url))
      )
    );
  }

  continuePollingEffect(
    flow$: Observable<PreviewPollingActionsProps & Action<string>>
  ): Observable<Action<string>> {
    return flow$.pipe(
      concatLatestFrom(() =>
        this.store
          .select(accountFeature.selectActiveAccount)
          .pipe(map(account => account?.previewlyToken))
      ),
      switchMap(([{ urls }, token]) =>
        token
          ? concat(
              ...urls.map(url =>
                this.api
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
                          throw new Error(
                            preview.error || 'Something was wrong'
                          );
                        default:
                          return { status: Status.LOADING };
                      }
                    }),
                    catchError(exception =>
                      of({ status: Status.ERROR, error: exception })
                    ),
                    map(preview => ({
                      url: url.toString(),
                      preview: preview,
                    }))
                  )
              )
            ).pipe(
              toArray(),
              map(previews =>
                PreviewActions.successUpdatePreviews({ previews })
              )
            )
          : of(AuthActions.dispatchEmptyPreviewlyTokenError())
      )
    );
  }
}