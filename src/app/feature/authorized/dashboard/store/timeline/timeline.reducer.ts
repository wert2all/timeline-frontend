import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { SharedActions } from '../../../../../shared/store/shared/shared.actions';
import { AddTimelineActions } from '../../../../timeline/store/actions/add-timeline.actions';
import { LoadTimelinesActions } from '../../../../timeline/store/actions/load-timelines.actions';
import { SetActiveTimelineActions } from '../../../../timeline/store/actions/set-active.actions';
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
      AddTimelineActions.addTimeline,
      LoadTimelinesActions.loadAccountTimelines,
      (state): TimelineState => ({ ...state, loading: true })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      LoadTimelinesActions.successLoadAccountTimelines,
      (state): TimelineState => ({ ...state, loading: false })
    ),

    on(
      AddTimelineActions.emptyTimeline,
      AddTimelineActions.apiException,
      (state): TimelineState => ({ ...state, loading: false })
    ),

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
