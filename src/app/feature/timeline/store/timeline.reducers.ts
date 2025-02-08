import { createFeature, createReducer, on } from '@ngrx/store';
import { TimelineActions } from './timeline.actions';
import { NewTimelineState } from './timeline.types';

const initialState: NewTimelineState = {
  loading: false,
  events: [],
  error: null,
  lastCursor: null,
  hasMore: false,
};
export const timelineFeature = createFeature({
  name: 'new-timeline',
  reducer: createReducer(
    initialState,

    on(
      TimelineActions.loadTimelineEvents,
      (state): NewTimelineState => ({ ...state, loading: true })
    ),
    on(
      TimelineActions.successLoadTimeline,
      (state): NewTimelineState => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.successLoadTimeline,
      (state, { events, lastCursor, hasMore }) => ({
        ...state,
        events: [...state.events, ...events],
        lastCursor,
        hasMore,
      })
    ),

    on(
      TimelineActions.errorLoadingTimelineEvent,
      (state, { error }): NewTimelineState => ({
        ...state,
        loading: false,
        error: error,
      })
    )
  ),
});
