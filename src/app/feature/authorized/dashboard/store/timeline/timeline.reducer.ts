import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { TimelineActions } from './timeline.actions';
import { TimelineState } from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  timelines: [],
  activeTimeline: null,
  newTimelineAdded: false,
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,
    on(
      TimelineActions.addTimeline,
      TimelineActions.loadAccountTimelines,
      (state): TimelineState => ({ ...state, loading: true })
    ),

    on(
      TimelineActions.successAddTimeline,
      TimelineActions.successLoadAccountTimelines,
      (state): TimelineState => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.emptyTimeline,
      TimelineActions.emptyTimelines,
      TimelineActions.apiException,
      (state): TimelineState => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.successAddTimeline,
      (state, { timelines }): TimelineState => ({
        ...state,
        timelines: [...timelines, ...state.timelines],
      })
    ),

    on(
      TimelineActions.successAddTimeline,
      (state): TimelineState => ({
        ...state,
        newTimelineAdded: true,
      })
    ),

    on(SharedActions.logout, (): TimelineState => initialState),

    on(
      TimelineActions.successLoadAccountTimelines,
      (state, { timelines }): TimelineState => ({
        ...state,
        timelines,
      })
    ),

    on(
      TimelineActions.setActiveTimeline,
      (state, { timeline }): TimelineState => ({
        ...state,
        activeTimeline: {
          name: timeline.name || '',
          id: timeline.id,
        },
      })
    )
  ),

  extraSelectors: ({ selectLoading, selectActiveTimeline }) => {
    return {
      isLoading: createSelector(selectLoading, loading => loading),
      selectActiveTimelineId: createSelector(
        selectActiveTimeline,
        timeline => timeline?.id
      ),
    };
  },
});
