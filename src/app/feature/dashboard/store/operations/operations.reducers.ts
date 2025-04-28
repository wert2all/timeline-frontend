import { createFeature, createReducer, on } from '@ngrx/store';
import { LoadTimelinesActions } from '../../../timeline/store/actions/load-timelines.actions';
import { AddTimelineActions } from './actions/add-timeline.actions';
import { SetActiveTimelineActions } from './actions/set-active-timeline.actions';
import { DashboardOperationsState } from './operations.types';

const initState: DashboardOperationsState = {
  loading: false,
  operations: [],
  currentTimeline: null,
  newTimelineAdded: false,
  activeAcccountTimelines: [],
};

export const dashboardOperationsFeature = createFeature({
  name: 'dashboard operation',
  reducer: createReducer(
    initState,

    on(
      AddTimelineActions.addTimeline,
      (state): DashboardOperationsState => ({ ...state, loading: true })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      AddTimelineActions.failedAddTimeline,
      (state): DashboardOperationsState => ({ ...state, loading: false })
    ),

    on(
      SetActiveTimelineActions.setActiveTimeline,
      (state, { timeline }): DashboardOperationsState => ({
        ...state,
        currentTimeline: {
          id: timeline.id,
          name: timeline.name,
          events: [],
          hasMore: false,
          lastCursor: null,
        },
      })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      (state): DashboardOperationsState => ({
        ...state,
        newTimelineAdded: true,
      })
    ),

    on(
      AddTimelineActions.successAddTimeline,
      (state, { timelines }): DashboardOperationsState => ({
        ...state,
        activeAcccountTimelines: [
          ...timelines,
          ...state.activeAcccountTimelines,
        ],
      })
    ),

    on(
      LoadTimelinesActions.successLoadAccountTimelines,
      (state, { timelines }): DashboardOperationsState => ({
        ...state,
        activeAcccountTimelines: timelines.map(timeline => ({
          ...timeline,
          name: timeline.name || '',
        })),
      })
    )
  ),
});
