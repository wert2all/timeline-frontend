import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { EventType, TimelineEvent } from '../../../events/store/events.types';
import { LoadTimelinesActions } from '../../../timeline/store/actions/load-timelines.actions';
import { AddTimelineActions } from './actions/add-timeline.actions';
import { EditEventActions } from './actions/edit-event.actions';
import { SetActiveTimelineActions } from './actions/set-active-timeline.actions';
import { DashboardOperationsState } from './operations.types';

const createDefaultTimelineEvent = (timelineId: number): TimelineEvent => ({
  date: new Date(),
  type: EventType.default,
  timelineId: timelineId,
  loading: false,
});

const initState: DashboardOperationsState = {
  loading: false,
  operations: [],
  currentTimeline: null,
  newTimelineAdded: false,
  activeAcccountTimelines: [],
  editedEvent: null,
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
    ),

    on(
      EditEventActions.dispatchAddNewEvent,
      (state, { timelineId }): DashboardOperationsState => ({
        ...state,
        editedEvent: createDefaultTimelineEvent(timelineId),
      })
    ),

    on(
      EditEventActions.stopEditingEvent,
      EditEventActions.successPushNewEvent,
      EditEventActions.successUpdateEvent,
      (state): DashboardOperationsState => ({
        ...state,
        editedEvent: null,
      })
    ),

    on(
      EditEventActions.successLoadEditEvent,
      (state, { event }): DashboardOperationsState => ({
        ...state,
        editedEvent: event,
      })
    )
  ),
  extraSelectors: ({ selectEditedEvent }) => ({
    isEditingEvent: createSelector(selectEditedEvent, event => !!event),
  }),
});
