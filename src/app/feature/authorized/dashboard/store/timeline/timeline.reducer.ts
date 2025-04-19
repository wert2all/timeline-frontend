import { createFeature, createReducer, on } from '@ngrx/store';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { AddTimelineActions } from '../../../../timeline/store/actions/add-timeline.actions';
import { LoadTimelinesActions } from '../../../../timeline/store/actions/load-timelines.actions';
import { SetActiveTimelineActions } from '../../../../timeline/store/actions/set-active.actions';
import { TimelineState } from './timeline.types';

const initialState: TimelineState = {
  timelines: [],
  activeTimeline: null,
  newTimelineAdded: false,
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,

    on(
      AddTimelineActions.successAddTimeline,
      (state, { timelines }): TimelineState => ({
        ...state,
        timelines: [...timelines, ...state.timelines],
      })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      (state): TimelineState => ({
        ...state,
        newTimelineAdded: true,
      })
    ),

    on(SharedActions.logout, (): TimelineState => initialState),

    on(
      LoadTimelinesActions.successLoadAccountTimelines,
      (state, { timelines }): TimelineState => ({
        ...state,
        timelines: timelines.map(timeline => ({
          ...timeline,
          name: timeline.name || '',
        })),
      })
    ),

    on(
      SetActiveTimelineActions.setActiveTimeline,
      (state, { timeline }): TimelineState => ({
        ...state,
        activeTimeline: {
          name: timeline.name || '',
          id: timeline.id,
        },
      })
    )
  ),
});
