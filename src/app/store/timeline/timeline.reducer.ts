import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from '../auth/auth.actions';
import { eventsFeature } from '../events/events.reducer';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from './editable-event-view.factory';
import { TimelineActions } from './timeline.actions';
import { ExistViewTimelineEvent, TimelineState } from './timeline.types';

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

    on(AuthActions.afterLogout, (): TimelineState => initialState),

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
    const selectActiveTimelineEventsSelector = createSelector(
      eventsFeature.selectEvents,
      selectActiveTimeline,
      (selectEvents, activeTimeline) =>
        Object.values(selectEvents)
          .filter(event => event.timelineId === activeTimeline?.id)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
    );
    const selectShouldEditEventSelector = createSelector(
      eventsFeature.selectShowEditEventId,
      selectActiveTimelineEventsSelector,
      selectActiveTimeline,
      (editEventId, events, activeTimeline) =>
        activeTimeline?.id && editEventId === 0
          ? createDefaultTimelineEvent(activeTimeline.id)
          : events.find(event => event.id === editEventId)
    );

    return {
      isLoading: createSelector(selectLoading, loading => loading),
      selectActiveTimelineEvents: selectActiveTimelineEventsSelector,
      selectActiveTimelineViewEvents: createSelector(
        selectActiveTimelineEventsSelector,
        events =>
          events.map(
            (event): ExistViewTimelineEvent => ({
              ...createViewTimelineEvent(event),
              id: event.id,
            })
          )
      ),
      isEditingEvent: createSelector(
        selectShouldEditEventSelector,
        event => !!event
      ),
      selectShouldEditEvent: selectShouldEditEventSelector,
      selectUploadedImageId: createSelector(
        selectShouldEditEventSelector,
        event => event?.imageId
      ),
    };
  },
});
