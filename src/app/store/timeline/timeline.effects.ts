import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { StoreDispatchEffect } from '../../app.types';
import { AuthActions } from '../auth/auth.actions';
import { TimelineActions } from './timeline.actions';

const updateTimelines = (action$ = inject(Actions)) =>
  action$.pipe(
    ofType(AuthActions.loadUserSucces),
    map(({ user }) =>
      user.timelines.map(timeline => ({
        id: timeline.id,
        name: timeline.name || null,
      }))
    ),
    map(timelines =>
      TimelineActions.updateTimelinesAfterAuthorize({ timelines: timelines })
    )
  );

export const timelineEffects = {
  addTimelines: createEffect(updateTimelines, StoreDispatchEffect),
};
