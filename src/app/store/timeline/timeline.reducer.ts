import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { updateStateRecord } from '../../libs/state.functions';
import { AuthActions } from '../auth/auth.actions';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from './editable-event-view.factory';
import { EventActions, TimelineActions } from './timeline.actions';
import {
  ExistTimelineEvent,
  ExistViewTimelineEvent,
  TimelineState,
} from './timeline.types';

const initialState: TimelineState = {
  loading: false,
  timelines: [],
  activeTimeline: null,
  events: [],
  newTimelineAdded: false,
  showEditEventId: null,
};

export const timelineFeature = createFeature({
  name: 'timeline',
  reducer: createReducer(
    initialState,
    on(
      TimelineActions.addTimeline,
      EventActions.loadTimelineEvents,
      TimelineActions.loadAccountTimelines,
      state => ({ ...state, loading: true })
    ),

    on(
      TimelineActions.successAddTimeline,
      EventActions.successLoadTimelineEvents,
      TimelineActions.successLoadAccountTimelines,
      state => ({ ...state, loading: false })
    ),

    on(
      TimelineActions.emptyTimeline,
      TimelineActions.emptyTimelines,
      TimelineActions.apiException,
      EventActions.apiException,
      EventActions.emptyEvent,
      state => ({ ...state, loading: false })
    ),

    on(TimelineActions.successAddTimeline, (state, { timelines }) => ({
      ...state,
      timelines: [...timelines, ...state.timelines],
    })),

    on(EventActions.emptyEvent, EventActions.apiException, state => ({
      ...state,
      events: updateStateRecord(
        state.events,
        Object.values(state.events).filter(event => event.loading)
      ),
    })),

    on(
      EventActions.successLoadTimelineEvents,
      EventActions.successUpdateEvent,
      EventActions.successPushNewEvent,
      (state, { events }) => ({
        ...state,
        events: updateStateRecord(state.events, events),
      })
    ),

    on(TimelineActions.successAddTimeline, state => ({
      ...state,
      newTimelineAdded: true,
    })),

    on(
      EventActions.stopEditingEvent,
      EventActions.successPushNewEvent,
      EventActions.successUpdateEvent,
      (state): TimelineState => ({ ...state, showEditEventId: null })
    ),

    on(EventActions.deleteEvent, (state, { eventId }) =>
      state.events[eventId]
        ? {
            ...state,
            events: updateStateRecord<ExistTimelineEvent>(state.events, [
              { ...state.events[eventId], loading: true },
            ]),
          }
        : state
    ),

    on(EventActions.successDeleteEvent, (state, { eventId }) =>
      state.events[eventId]
        ? {
            ...state,
            events: Object.values(state.events)
              .filter(event => event.id !== eventId)
              .reduce((acc: Record<number, ExistTimelineEvent>, event) => {
                acc[event.id] = event;
                return acc;
              }, {}),
          }
        : state
    ),

    on(EventActions.failedDeleteEvent, (state, { eventId }) =>
      state.events[eventId]
        ? {
            ...state,
            events: updateStateRecord(state.events, [
              { ...state.events[eventId], loading: false },
            ]),
          }
        : state
    ),

    on(AuthActions.afterLogout, () => initialState),

    on(TimelineActions.successLoadAccountTimelines, (state, { timelines }) => ({
      ...state,
      timelines,
    })),

    on(TimelineActions.setActiveTimeline, (state, { timeline }) => ({
      ...state,
      activeTimeline: {
        name: timeline.name || '',
        id: timeline.id,
      },
    })),
    on(EventActions.dispatchEditEvent, (state, { eventId }) => ({
      ...state,
      showEditEventId: eventId,
    }))
  ),

  extraSelectors: ({
    selectEvents,
    selectLoading,
    selectActiveTimeline,
    selectShowEditEventId,
  }) => {
    const selectActiveTimelineEventsSelector = createSelector(
      selectEvents,
      selectActiveTimeline,
      (selectEvents, activeTimeline) =>
        Object.values(selectEvents)
          .filter(event => event.timelineId === activeTimeline?.id)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
    );
    const selectShouldEditEventSelector = createSelector(
      selectShowEditEventId,
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
