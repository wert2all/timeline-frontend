import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import { StoreDispatchEffect } from '../../../../app.types';
import { NavigationBuilder } from '../../../../shared/services/navigation/navigation.builder';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { AddTimelineActions } from '../actions/add-timeline.actions';
import { LoadTimelinesActions } from '../actions/load-timelines.actions';
import { SetActiveTimelineActions } from '../actions/set-active.actions';

export const addTimelineEffects = {
  setActiveTimeline: createEffect((action$ = inject(Actions)) => {
    return action$.pipe(
      ofType(
        AddTimelineActions.successAddTimeline,
        LoadTimelinesActions.successLoadAccountTimelines
      ),
      map(({ timelines, accountId }) => ({
        timeline: timelines.length > 0 ? timelines[0] || null : null,
        accountId: accountId,
      })),
      map(options =>
        options.timeline
          ? SetActiveTimelineActions.setActiveTimeline({
              timeline: {
                ...options.timeline,
                name: options.timeline.name || '',
                accountId: options.accountId,
              },
              accountId: options.accountId,
            })
          : SetActiveTimelineActions.shouldNotSetActiveTimeline()
      )
    );
  }, StoreDispatchEffect),

  addTimeline: createEffect(
    (
      action$ = inject(Actions),
      api = inject(ApiClient),
      store = inject(Store)
    ) => {
      return action$.pipe(
        ofType(AddTimelineActions.addTimeline),
        concatLatestFrom(() =>
          store.select(sharedFeature.selectActiveAccountId)
        ),
        map(([{ name }, accountId]) => {
          if (!accountId) {
            throw new Error('Could not add timeline.');
          }

          return { name: name, accountId };
        }),
        exhaustMap(({ name, accountId }) =>
          api.addTimelineMutation({ timeline: { name, accountId } }).pipe(
            map(result => result.data?.timeline || null),
            map(timeline =>
              timeline
                ? AddTimelineActions.successAddTimeline({
                    accountId: timeline.accountId,
                    timelines: [
                      {
                        id: timeline.id,
                        name: timeline.name || '',
                        accountId: timeline.accountId,
                      },
                    ],
                  })
                : AddTimelineActions.emptyTimeline()
            ),
            catchError(exception =>
              of(AddTimelineActions.apiException({ exception: exception }))
            )
          )
        )
      );
    },
    StoreDispatchEffect
  ),

  emptyProfile: createEffect((action$ = inject(Actions)) => {
    return action$.pipe(
      ofType(AddTimelineActions.emptyTimeline),
      map(() =>
        SharedActions.sendNotification({
          message: 'Cannot add timeline',
          withType: 'error',
        })
      )
    );
  }, StoreDispatchEffect),

  apiException: createEffect((action$ = inject(Actions)) => {
    return action$.pipe(
      ofType(AddTimelineActions.apiException),
      map(() =>
        SharedActions.sendNotification({
          message: 'Something went wrong. Try again later',
          withType: 'error',
        })
      )
    );
  }, StoreDispatchEffect),

  redirectOnSuccess: createEffect(
    (
      action$ = inject(Actions),
      navigationBuilder = inject(NavigationBuilder)
    ) => {
      return action$.pipe(
        ofType(AddTimelineActions.successAddTimeline),
        map(() =>
          SharedActions.navigate({
            destination: navigationBuilder.forDashboard().index(),
          })
        )
      );
    },
    StoreDispatchEffect
  ),
};
