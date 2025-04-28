import { createFeature, createReducer, on } from '@ngrx/store';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { AddTimelineActions } from '../../dashboard/store/operations/actions/add-timeline.actions';
import { ShowEventActions } from '../../events/store/actions/show.actions';
import { ListEventsActions } from './actions/list-timeline-events.actions';
import { LoadTimelinesActions } from './actions/load-timelines.actions';
import { TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  timelines: {},
  error: null,
  lastCursor: null,
  hasMore: false,
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,

    on(
      ListEventsActions.loadTimelineEvents,
      LoadTimelinesActions.loadTimeline,
      AddTimelineActions.addTimeline,
      LoadTimelinesActions.loadAccountTimelines,
      (state): TimelineState => ({ ...state, loading: true })
    ),
    on(
      ListEventsActions.successLoadTimelineEvents,
      LoadTimelinesActions.successLoadTimeline,
      AddTimelineActions.successAddTimeline,
      LoadTimelinesActions.successLoadAccountTimelines,
      AddTimelineActions.failedAddTimeline,
      (state): TimelineState => ({ ...state, loading: false })
    ),

    on(
      ListEventsActions.successLoadTimelineEvents,
      (state, { lastCursor, hasMore }): TimelineState => ({
        ...state,
        lastCursor,
        hasMore,
      })
    ),

    on(
      ListEventsActions.errorLoadingTimelineEvents,
      LoadTimelinesActions.errorLoadTimeline,
      (state, { error }): TimelineState => ({
        ...state,
        loading: false,
        error: error,
      })
    ),

    on(
      LoadTimelinesActions.successLoadTimeline,
      (state, { timeline }): TimelineState => {
        const timelines = { ...state.timelines };
        timelines[timeline.id] = {
          id: timeline.id,
          name: timeline.name || '',
          accountId: timeline.account.id,
        };

        return { ...state, timelines: timelines };
      }
    ),
    on(ShowEventActions.successLoadEvent, (state, { event }): TimelineState => {
      const timelines = { ...state.timelines };
      timelines[event.timelineId] = {
        id: event.timeline.id,
        name: event.timeline.name || '',
        accountId: event.timeline.account.id,
      };
      return { ...state, timelines };
    }),

    on(SharedActions.logout, (): TimelineState => initialState)
  ),
});
