import { inject, Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  catchError,
  concat,
  interval,
  map,
  Observable,
  of,
  switchMap,
  takeUntil,
  toArray,
} from 'rxjs';
import { previewlyApiClient } from '../../api/external/previewly/graphql';
import { DataWrapper, Status } from '../../app.types';
import { accountFeature } from '../../store/account/account.reducer';
import { AuthActions } from '../../store/auth/auth.actions';
import { PreviewActions } from '../../store/preview/preview.actions';
import { previewFeature } from '../../store/preview/preview.reducers';
import { PreviewItem } from '../../store/preview/preview.types';
import { apiAssertNotNull, extractApiData } from '../api.functions';
import { Polling, PollingAction, PollingItem } from './polling.types';

type PreviewProps = { urls: PollingItem<URL>[] };

const DELAY = 3000;

@Injectable({ providedIn: 'root' })
export class PreviewFactory implements Polling {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private api = inject(previewlyApiClient);

  private startPollingAction: PollingAction<PreviewProps> =
    PreviewActions.startPollingPreviews;
  private stopPollingAction: PollingAction<void> =
    PreviewActions.stopPollingPreviews;
  private continuePollingAction: PollingAction<PreviewProps> =
    PreviewActions.continuePollingPreviews;

  private selectPollingItems: (
    actions: Actions
  ) => Observable<PollingItem<URL>[]> = (
    actions: Actions,
    store = inject(Store)
  ) =>
    actions.pipe(
      ofType(PreviewActions.successAddingURL),
      concatLatestFrom(() => store.select(previewFeature.selectShouldUpdate)),
      map(([, shouldUpdate]) =>
        shouldUpdate.map(preview => new URL(preview.url))
      )
    );

  startPolling(): Observable<Action<string>> {
    return this.selectPollingItems(this.actions$).pipe(
      map(this.shouldContinue(this.startPollingAction))
    );
  }

  stopPolling(): Observable<Action<string>> {
    return this.selectPollingItems(this.actions$).pipe(
      map(this.shouldContinue(this.continuePollingAction))
    );
  }

  continuePolling(): Observable<Action<string>> {
    return this.selectContinuePolling().pipe(
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

  private shouldContinue(action: PollingAction<PreviewProps>) {
    return (items: PollingItem<URL>[]) =>
      items.length > 0 ? action({ urls: items }) : this.stopPollingAction();
  }

  private selectContinuePolling() {
    return this.actions$.pipe(
      ofType(this.startPollingAction),
      switchMap(action =>
        interval(DELAY).pipe(
          takeUntil(this.actions$.pipe(ofType(this.stopPollingAction))),
          map(() => action)
        )
      )
    );
  }
}
