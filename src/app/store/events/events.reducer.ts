import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import {
  createDefaultTimelineEvent,
  createViewTimelineEvent,
} from '../../feature/edit-event/editable-event-view.factory';
import { updateStateRecord } from '../../libs/state.functions';
import { timelineFeature } from '../timeline/timeline.reducer';
import { ExistViewTimelineEvent } from '../timeline/timeline.types';
import { EventActions } from './events.actions';
import { EventsState, ExistTimelineEvent } from './events.types';

const initialState: EventsState = {
  events: {},
  loading: false,
  hasNextPage: false,
  nextCursor: undefined,
  showEditEventId: null,
};
export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialState,
    on(
      EventActions.loadTimelineEvents,
      EventActions.loadMoreEvents,
      (state): EventsState => ({ ...state, loading: true })
    ),

    on(
      EventActions.emptyEvent,
      EventActions.apiException,
      EventActions.successLoadTimelineEvents,
      EventActions.successUpdateEvent,
      EventActions.successPushNewEvent,
      EventActions.successLoadTimelineEvents,
      (state): EventsState => ({
        ...state,
        loading: false,
      })
    ),

    on(
      EventActions.successLoadTimelineEvents,
      EventActions.successUpdateEvent,
      EventActions.successPushNewEvent,
      (state, { events }): EventsState => ({
        ...state,
        events: updateStateRecord(state.events, events),
      })
    ),

    on(
      EventActions.successLoadTimelineEvents,
      (state, { cursor, hasNextPage }): EventsState => ({
        ...state,
        nextCursor: cursor,
        hasNextPage: hasNextPage,
      })
    ),

    on(
      EventActions.stopEditingEvent,
      EventActions.successPushNewEvent,
      EventActions.successUpdateEvent,
      (state): EventsState => ({ ...state, showEditEventId: null })
    ),

    on(
      EventActions.dispatchEditEvent,
      (state, { eventId }): EventsState => ({
        ...state,
        showEditEventId: eventId,
      })
    ),

    on(
      EventActions.emptyEvent,
      EventActions.apiException,
      (state): EventsState => ({
        ...state,
        events: updateStateRecord(
          state.events,
          Object.values(state.events).filter(event => event.loading)
        ),
      })
    ),

    on(
      EventActions.deleteEvent,
      (state, { eventId }): EventsState =>
        state.events[eventId]
          ? {
              ...state,
              events: updateStateRecord<ExistTimelineEvent>(state.events, [
                { ...state.events[eventId], loading: true },
              ]),
            }
          : state
    ),

    on(
      EventActions.successDeleteEvent,
      (state, { eventId }): EventsState =>
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

    on(
      EventActions.failedDeleteEvent,
      (state, { eventId }): EventsState =>
        state.events[eventId]
          ? {
              ...state,
              events: updateStateRecord(state.events, [
                { ...state.events[eventId], loading: false },
              ]),
            }
          : state
    )
  ),
  extraSelectors: ({ selectShowEditEventId, selectEvents }) => {
    const selectActiveTimelineEventsSelector = createSelector(
      selectEvents,
      timelineFeature.selectActiveTimeline,
      (selectEvents, activeTimeline) =>
        Object.values(selectEvents)
          .filter(event => event.timelineId === activeTimeline?.id)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
    );
    const selectShouldEditEventSelector = createSelector(
      selectShowEditEventId,
      selectActiveTimelineEventsSelector,
      timelineFeature.selectActiveTimeline,
      (editEventId, events, activeTimeline) =>
        activeTimeline?.id && editEventId === 0
          ? createDefaultTimelineEvent(activeTimeline.id)
          : events.find(event => event.id === editEventId)
    );

    return {
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
