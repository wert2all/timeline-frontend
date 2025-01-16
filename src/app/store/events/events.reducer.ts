import { createFeature, createReducer, on } from '@ngrx/store';
import { updateStateRecord } from '../../libs/state.functions';
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
  extraSelectors: () => ({}),
});
