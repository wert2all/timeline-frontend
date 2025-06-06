import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { ShowEventActions } from '../actions/show.actions';

export const showEventEffects = {
  loadEvent: createEffect(
    (
      actions$ = inject(Actions),
      api = inject(ApiClient),
      store = inject(Store)
    ) => {
      return actions$.pipe(
        ofType(ShowEventActions.loadEvent),
        concatLatestFrom(() => store.select(sharedFeature.selectActiveAccount)),
        exhaustMap(([{ eventId }, account]) =>
          api.getEvent({ eventId, accountId: account?.id }).pipe(
            map(result =>
              apiAssertNotNull(extractApiData(result)?.event, 'Event not found')
            ),
            map(event => ShowEventActions.successLoadEvent({ event }))
          )
        ),
        catchError(error => of(ShowEventActions.errorLoadEvent({ error })))
      );
    },
    StoreDispatchEffect
  ),
  dispatchLoadImagesAfterSuccess: createEffect((actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(ShowEventActions.successLoadEvent),
      map(({ event }) =>
        SharedActions.dispatchLoadingImages({
          ids: event.previewlyImageId ? [event.previewlyImageId] : [],
        })
      )
    );
  }, StoreDispatchEffect),
};
