import { inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { LoadTimelinesActions } from '../../../../timeline/store/actions/load-timelines.actions';
import { SetActiveTimelineActions } from '../../../../timeline/store/actions/set-active.actions';
import { AddTimelineActions } from '../actions/add-timeline.actions';

export const setActiveTimeline = (action$ = inject(Actions)) =>
  action$.pipe(
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
